import { Billboard } from '@/components/ui/organism/billboard/billboard';

const BillboardsPage = () => {
  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <Billboard></Billboard>
        </div>
      </div>
    </>
  );
};

export default BillboardsPage;
