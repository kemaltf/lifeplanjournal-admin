import { BillboardForm } from '@/components/ui/organism/billboard/billboard-form';
import prismadb from '@/lib/prismadb';

const BillboardPage = async ({ params }: { params: { billboardsId: string } }) => {
  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: params.billboardsId,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard}></BillboardForm>
      </div>
    </div>
  );
};

export default BillboardPage;
