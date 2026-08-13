import { useState } from 'react';
import { User, ShoppingBag, Heart, Clock, LogOut, Leaf, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { SMSLogin } from '../components/auth/SMSLogin';
import { EmptyState } from '../components/ui/Skeleton';

export function AccountPage() {
  const { authed, signOut } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  if (!authed) {
    return showLogin ? (
      <div className="safe-top">
        <button
          onClick={() => setShowLogin(false)}
          className="px-4 pt-6 btn-ghost text-sm"
        >
          ← Back
        </button>
        <SMSLogin onSuccess={() => setShowLogin(false)} />
      </div>
    ) : (
      <div className="safe-top">
        <header className="px-4 pt-6 pb-4">
          <div className="flex items-center gap-2">
            <User size={22} className="text-market-700" />
            <h1 className="text-xl font-display font-bold text-gray-900">Account</h1>
          </div>
        </header>

        <div className="px-4">
          <EmptyState
            icon={<User size={48} />}
            title="Sign in to get started"
            description="Track your pantry, save favorite recipes, and see your market history."
            action={
              <button onClick={() => setShowLogin(true)} className="btn-primary">
                Sign In with Phone
              </button>
            }
          />

          {/* Preview features */}
          <div className="mt-8 space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-1">
              Unlock with Sign In
            </h3>
            <FeaturePreview icon={<ShoppingBag size={20} />} label="Shopping List" description="Save your market list across visits" />
            <FeaturePreview icon={<Clock size={20} />} label="Pantry Tracker" description="Know what you bought and when" />
            <FeaturePreview icon={<Heart size={20} />} label="Favorites" description="Save go-to recipes and vendors" />
          </div>
        </div>
      </div>
    );
  }

  // Authenticated view
  return (
    <div className="safe-top">
      <header className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User size={22} className="text-market-700" />
            <h1 className="text-xl font-display font-bold text-gray-900">Account</h1>
          </div>
          <button onClick={signOut} className="btn-ghost text-sm text-red-500">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </header>

      <div className="px-4 space-y-4 mb-8">
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Trips" value="3" />
          <StatCard label="Recipes" value="5" />
          <StatCard label="Vendors" value="7" />
        </div>

        {/* Menu items */}
        <div className="card divide-y divide-gray-50">
          <MenuItem icon={<ShoppingBag size={18} />} label="Shopping Lists" />
          <MenuItem icon={<Clock size={18} />} label="Pantry" />
          <MenuItem icon={<Heart size={18} />} label="Favorite Recipes" />
          <MenuItem icon={<Leaf size={18} />} label="My Seasonal Picks" />
        </div>

        <p className="text-xs text-gray-400 text-center">
          More features coming soon — pantry insights, spending trends, and recipe suggestions based on what you buy.
        </p>
      </div>
    </div>
  );
}

function FeaturePreview({ icon, label, description }: { icon: React.ReactNode; label: string; description: string }) {
  return (
    <div className="card p-4 flex items-center gap-3 opacity-60">
      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-sm text-gray-700">{label}</h4>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-3 text-center">
      <p className="text-2xl font-bold text-market-700">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}

function MenuItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left">
      <span className="text-gray-500">{icon}</span>
      <span className="text-sm font-medium text-gray-900 flex-1">{label}</span>
      <ChevronRight size={16} className="text-gray-300" />
    </button>
  );
}
