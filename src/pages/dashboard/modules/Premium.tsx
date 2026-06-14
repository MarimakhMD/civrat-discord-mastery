import { Star } from 'lucide-react';
import { ModuleHeader } from '@/components/ui/ModuleHeader';

const features = [
  { name: 'Unlimited Modules', free: false, premium: true },
  { name: 'Advanced Logging', free: false, premium: true },
  { name: 'Custom Embeds', free: true, premium: true },
  { name: 'Analytics Dashboard', free: false, premium: true },
  { name: 'Priority Support', free: false, premium: true },
  { name: 'Backup & Restore', free: false, premium: true },
  { name: 'Anti-Raid Protection', free: false, premium: true },
  { name: 'Voice Channel Management', free: false, premium: true },
];

const pricingPlans = [
  {
    name: 'Pro',
    price: '$4.99',
    period: '/month',
    features: ['Unlimited Modules', 'Advanced Logging', 'Analytics'],
    cta: 'Upgrade to Pro',
  },
  {
    name: 'Premium',
    price: '$9.99',
    period: '/month',
    features: ['All Pro Features', 'Priority Support', 'Backup & Restore'],
    cta: 'Upgrade to Premium',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    features: ['Everything', 'Dedicated Support', 'Custom Features'],
    cta: 'Contact Sales',
  },
];

export default function Premium() {
  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={Star}
        title="Premium Features"
        description="Unlock advanced features with premium subscription"
      />

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h3 className="mb-6 text-lg font-semibold">Feature Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-4 py-2 text-left font-medium">Feature</th>
                <th className="px-4 py-2 text-center font-medium">Free</th>
                <th className="px-4 py-2 text-center font-medium">Premium</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature) => (
                <tr key={feature.name} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">{feature.name}</td>
                  <td className="px-4 py-3 text-center">
                    {feature.free ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-slate-400">✗</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-green-600">✓</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {pricingPlans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-lg border p-6 ${
              plan.popular
                ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-white shadow-lg'
                : 'border-slate-200 bg-white'
            }`}
          >
            {plan.popular && (
              <div className="mb-4 inline-block rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                Most Popular
              </div>
            )}

            <h3 className="mb-2 text-xl font-bold">{plan.name}</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span className="text-slate-600">/{plan.period}</span>
            </div>

            <button
              className={`w-full rounded py-2 font-semibold text-white mb-6 ${
                plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-600 hover:bg-slate-700'
              }`}
            >
              {plan.cta}
            </button>

            <ul className="space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <span className="text-green-600">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
        <h3 className="mb-2 font-semibold text-blue-900">Current Plan</h3>
        <p className="text-sm text-blue-800">
          You are currently on the <strong>Free</strong> plan. Upgrade to Premium to unlock all features!
        </p>
      </div>
    </div>
  );
}
