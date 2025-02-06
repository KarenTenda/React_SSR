
"use client";
import AddGraphForm from './AddGraphForm';
import CustomModal from '@/components/custom/modals/CustomModal';
import { Button } from '@/components/ui/button'
import { useModal } from '@/providers/modal-provider';
import { Plus } from 'lucide-react'
import React from 'react'

type Props = {}

const AddGraphButton = (props: Props) => {
  const { setOpen, setClose } = useModal()

  const handleClick = () => {
    setOpen(
      <CustomModal
        title="Create a Workflow Automation"
        subheading="Workflows are a powerfull that help you automate tasks."
      >
        <AddGraphForm />
      </CustomModal>
    )
  }
  return (
    <Button size={'icon'} onClick={handleClick} disabled>
      <Plus />
    </Button>
  )
}

export default AddGraphButton