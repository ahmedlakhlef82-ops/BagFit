import { LoadingState } from '@/components/ui/loading-state';

export default function Loading() {
  return (
    <div className="flex h-[80vh] items-center justify-center">
      <LoadingState text="Loading..." />
    </div>
  );
}
