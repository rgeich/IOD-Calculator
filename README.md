# Lumen IoD Cost Calculator

A simple command-line tool to estimate your monthly Lumen Internet on Demand (IoD) costs — and see how much you'd save by scheduling bandwidth tiers during off-peak hours.

## Why This Exists

Lumen IoD bills hourly by bandwidth tier. Most circuits run at peak 24/7, even overnight when nobody's using them. Scheduling lower tiers during off-peak hours can cut your bill by 30–50%.

This calculator shows you the math.

## Lumen IoD Hourly Rates (2026)

| Tier | Hourly Rate |
|------|------------|
| 1 Mbps | $0.10 |
| 5 Mbps | $0.14 |
| 10 Mbps | $0.18 |
| 20 Mbps | $0.22 |
| 50 Mbps | $0.32 |
| 100 Mbps | $0.46 |
| 200 Mbps | $0.58 |
| 300 Mbps | $0.68 |
| 500 Mbps | $0.82 |
| 1 Gbps | $1.06 |
| 2 Gbps | $1.70 |
| 5 Gbps | $2.90 |
| 10 Gbps | $4.36 |

## Usage

```bash
node iod-calc.js
```

Or run with arguments:

```bash
node iod-calc.js --peak 1000 --offpeak 100 --hours 10 --days weekdays
```

### Options

| Flag | Description | Default |
|------|-------------|---------|
| `--peak` | Peak bandwidth in Mbps | 1000 |
| `--offpeak` | Off-peak bandwidth in Mbps | 100 |
| `--hours` | Business hours per day | 10 |
| `--days` | Schedule type: `weekdays`, `everyday`, or `custom` | weekdays |
| `--custom-days` | Days per week (used with `--days custom`) | 5 |

### Example

```
$ node iod-calc.js --peak 1000 --offpeak 100 --hours 10

  Lumen IoD Cost Calculator
  ─────────────────────────
  Peak tier:     1 Gbps ($1.06/hr)
  Off-peak tier: 100 Mbps ($0.46/hr)
  Schedule:      10 hrs/day, weekdays only

  Monthly Cost Comparison
  ─────────────────────────
  Always-on at 1 Gbps:    $763.20/mo
  With scheduling:         $508.36/mo
  ─────────────────────────
  Monthly savings:         $254.84
  Annual savings:          $3,058.08
  Savings percentage:      33.4%
```

## Automate It

This calculator shows the savings. To actually automate your IoD bandwidth scheduling, check out [Apptifi](https://apptifi.com) — a visual bandwidth scheduler that connects to the Lumen NaaS API to run your schedule automatically.

## License

MIT
