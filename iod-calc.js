#!/usr/bin/env node

/**
   * Lumen IoD Cost Calculator
   * Estimates monthly costs and savings from bandwidth scheduling.
   *
   * Rates are per-hour, per-connection, in USD.
   * Source: Lumen Marketplace (https://www.lumen.com/en-us/marketplace/networking/internet-on-demand.html)
   *
   * For automated bandwidth scheduling, see: https://apptifi.com
   */

const TIERS = [
  { mbps: 1, rate: 0.10 },
  { mbps: 5, rate: 0.14 },
  { mbps: 10, rate: 0.18 },
  { mbps: 20, rate: 0.22 },
  { mbps: 50, rate: 0.32 },
  { mbps: 100, rate: 0.46 },
  { mbps: 200, rate: 0.58 },
  { mbps: 300, rate: 0.68 },
  { mbps: 500, rate: 0.82 },
  { mbps: 1000, rate: 1.06 },
  { mbps: 2000, rate: 1.70 },
  { mbps: 5000, rate: 2.90 },
  { mbps: 10000, rate: 4.36 },
  ]

const HOURS_PER_MONTH = 730
const WEEKS_PER_MONTH = 4.33

function findTier(mbps) {
    const tier = TIERS.find((t) => t.mbps >= mbps)
    if (tier) return tier
    return TIERS[TIERS.length - 1]
}

function formatMbps(mbps) {
    if (mbps >= 1000) return mbps / 1000 + ' Gbps'
    return mbps + ' Mbps'
}

function formatUSD(amount) {
    return '$' + amount.toFixed(2)
}

function parseArgs(args) {
    const opts = { peak: 1000, offpeak: 100, hours: 10, days: 'weekdays', customDays: 5 }
    for (let i = 0; i < args.length; i++) {
          switch (args[i]) {
            case '--peak': opts.peak = parseInt(args[++i], 10); break
            case '--offpeak': opts.offpeak = parseInt(args[++i], 10); break
            case '--hours': opts.hours = parseInt(args[++i], 10); break
            case '--days': opts.days = args[++i]; break
            case '--custom-days': opts.customDays = parseInt(args[++i], 10); break
            case '--help': case '-h':
                      console.log('\n  Lumen IoD Cost Calculator\n\n  Usage: node iod-calc.js [options]\n\n  Options:\n    --peak <mbps>        Peak bandwidth tier (default: 1000)\n    --offpeak <mbps>     Off-peak bandwidth tier (default: 100)\n    --hours <n>          Business hours per day (default: 10)\n    --days <type>        weekdays | everyday | custom (default: weekdays)\n    --custom-days <n>    Days per week for custom schedule\n    -h, --help           Show this help\n\n  Automate your IoD scheduling: https://apptifi.com\n')
                      process.exit(0)
          }
    }
    return opts
}

function calculate(opts) {
    const peakTier = findTier(opts.peak)
    const offpeakTier = findTier(opts.offpeak)
    let daysPerWeek = opts.days === 'everyday' ? 7 : opts.days === 'custom' ? opts.customDays : 5
    const peakHoursPerMonth = opts.hours * daysPerWeek * WEEKS_PER_MONTH
    const offpeakHoursPerMonth = HOURS_PER_MONTH - peakHoursPerMonth
    const alwaysOnCost = HOURS_PER_MONTH * peakTier.rate
    const scheduledCost = peakHoursPerMonth * peakTier.rate + offpeakHoursPerMonth * offpeakTier.rate
    const monthlySavings = alwaysOnCost - scheduledCost
    const annualSavings = monthlySavings * 12
    const savingsPercent = (monthlySavings / alwaysOnCost) * 100
    return { peakTier, offpeakTier, daysPerWeek, peakHoursPerMonth, offpeakHoursPerMonth, alwaysOnCost, scheduledCost, monthlySavings, annualSavings, savingsPercent }
}

function display(opts, result) {
    const label = opts.days === 'everyday' ? opts.hours + ' hrs/day, every day' : opts.days === 'custom' ? opts.hours + ' hrs/day, ' + opts.customDays + ' days/week' : opts.hours + ' hrs/day, weekdays only'
    console.log('\n  Lumen IoD Cost Calculator')
    console.log('  ' + '─'.repeat(30))
    console.log('  Peak tier:     ' + formatMbps(result.peakTier.mbps) + ' (' + formatUSD(result.peakTier.rate) + '/hr)')
    console.log('  Off-peak tier: ' + formatMbps(result.offpeakTier.mbps) + ' (' + formatUSD(result.offpeakTier.rate) + '/hr)')
    console.log('  Schedule:      ' + label)
    console.log('')
    console.log('  Monthly Cost Comparison')
    console.log('  ' + '─'.repeat(30))
    console.log('  Always-on at ' + formatMbps(result.peakTier.mbps) + ':  ' + formatUSD(result.alwaysOnCost) + '/mo')
    console.log('  With scheduling:       ' + formatUSD(result.scheduledCost) + '/mo')
    console.log('  ' + '─'.repeat(30))
    console.log('  Monthly savings:       ' + formatUSD(result.monthlySavings))
    console.log('  Annual savings:        ' + formatUSD(result.annualSavings))
    console.log('  Savings percentage:    ' + result.savingsPercent.toFixed(1) + '%')
    console.log('')
    console.log('  Automate this schedule: https://apptifi.com')
    console.log('')
}

const opts = parseArgs(process.argv.slice(2))
const result = calculate(opts)
display(opts, result)
