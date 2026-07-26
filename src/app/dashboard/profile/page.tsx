import { Metadata } from 'next';
import { ProfileForm } from './components/profile-form';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: 'Profile Settings',
  description: 'Manage your profile settings.',
};

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Update your personal details and preferences.
        </p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  );
}
