"use client";
import React from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import ClickableIconButton from '@/components/custom/buttons/ClickableIconButton';
import { DeleteIcon } from '@/public/assets/Icons';
import { toast } from 'sonner';
import CustomModal from '@/components/custom/modals/CustomModal';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

type Props = {
  name: string;
  description: string;
  id: string;
  publish: boolean | null;
};

const TestGraphCard = ({ description, id, name, publish }: Props) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const onDeleteFlow = async () => {
    const response = await fetch('/api/graphs', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        graph_id: id,
      }),
    });

    console.log(response);

    if (response.ok) {
      toast.message('Graph saved successfully')
      // router.refresh();
      // router.push('/operations/workflows'); 
        window.location.reload();

    }
  };

  const onClose = () => {
    onDeleteFlow();
    setOpen(false);

  };

  const graphProps = {
    name,
    description,
    id,
    publish,
  };

  return (
    <Card className="flex w-full items-center justify-between">
      <CardHeader className="flex flex-col gap-4">
        <Link
          href={`/operations/workflows/components/graphBuilder/editor/${id}?graphProps=${encodeURIComponent(
            JSON.stringify(graphProps)
          )}`}
        >
          <div className="flex flex-row gap-2">
            {/* <Image
              src="/googleDrive.png"
              alt="Google Drive"
              height={30}
              width={30}
              className="object-contain"
            />
            <Image
              src="/notion.png"
              alt="Google Drive"
              height={30}
              width={30}
              className="object-contain"
            />
            <Image
              src="/discord.png"
              alt="Google Drive"
              height={30}
              width={30}
              className="object-contain"
            /> */}
          </div>
          <div className="">
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </Link>
      </CardHeader>
      <div className="flex">
        <div className="flex flex-col items-center gap-2 p-2">
          <Label htmlFor="airplane-mode" className="text-muted-foreground">
            Delete
          </Label>
          <ClickableIconButton
            Icon={DeleteIcon}
            onClick={() => setOpen(true)}
            // tooltipText='Delete'
            disabled={false}
          />
        </div>
        <div className="flex flex-col items-center gap-2 p-2">
          <Label htmlFor="airplane-mode" className="text-muted-foreground">
            {/* {publish! ? 'On' : 'Off'} */}
            Publish
          </Label>
          <Switch
            id="airplane-mode"
            //   onClick={onPublishFlow}
            className="bg-[#FA8072]"
            defaultChecked={publish!}
          // disabled
          />
        </div>
      </div>
      <CustomModal
        open={open}
        onClose={() => setOpen(false)}
        title="Deleting Workflow"
        description="Once you accept the workflow will be deleted from the database."
      >
        <Button onClick={onClose} className="mt-4 bg-[#FA8072] text-white">
          Delete
        </Button>
      </CustomModal>
    </Card>
  );
};

export default TestGraphCard;