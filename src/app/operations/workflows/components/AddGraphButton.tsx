
"use client";
import AddGraphForm from './AddGraphForm';
import CustomDrawer from '@/components/custom/modals/CustomDrawer';
import { Button } from '@/components/ui/button'
import { useModal } from '@/providers/modal-provider';
import { Plus } from 'lucide-react'
import React from 'react'

type Props = {}

const AddGraphButton = (props: Props) => {
  const { setOpen, setClose } = useModal()

  const handleClick = () => {
    setOpen(
      <CustomDrawer
        title="Create a Workflow Automation"
        subheading="Workflows are a powerfull that help you automate tasks."
      >
        <AddGraphForm />
      </CustomDrawer>
    )
  }
  return (
    <Button size={'icon'} onClick={handleClick}>
      <Plus />
    </Button>
  )
}

export default AddGraphButton