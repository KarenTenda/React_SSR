
'use client'
import { EditorNodeSpecificTypes, EditorNodeType } from '@/app/operations/workflows/types/EditorCanvasTypes'
import { useEditor } from '@/providers/editor-provider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { onDragStart } from '@/app/operations/workflows/utils/editor-utils'
import React, { use, useEffect, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { EditorCanvasDefaultCardTypes } from '@/app/operations/workflows/constants/EditorCanvasDefaultCardTypes'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import useCameraService from '@/app/cameras/hooks/useCameraService'
import CameraNodeSettings from '../../../../nodeBuilder/nodes/CameraNodeSetUp'
import { NodeManager } from '../../../../nodeBuilder/NodeManager'
import InferenceNodeSetUp from '../../../../nodeBuilder/nodes/InferenceNodeSetUp'
import StepNavigation from './StepNavigation'

type Props = {
  nodes: EditorNodeType[]
}

const EditorCanvasSidebar = ({ nodes }: Props) => {
  const { state, dispatch } = useEditor()
  const selectedNode = state.editor.selectedNode
  const selectedNodeInputHandles = selectedNode.data.metadata?.inputHandles || []
  const selectedNodeOutputHandles = selectedNode.data.metadata?.outputHandles || []
  const nodeManager = new NodeManager(selectedNode, dispatch, nodes);
  const hasSelectedNode = selectedNode && selectedNode.id !== ''
  const selectedHandle = state.editor.selectedNode.data.metadata?.selectedHandle;
  const [outputData, setOutputData] = useState<string>('')

  useEffect(() => {
    const data = selectedNodeOutputHandles[0]?.data ?? {}
    setOutputData(JSON.stringify(data, null, 2))
  }, [selectedNode])
  
  const renderExternalConfig = (type: EditorNodeSpecificTypes) => {
    switch (type) {
      case 'Camera':
        return <>
          <CameraNodeSettings
            selectedNode={selectedNode}
          />
        </>
      case 'Model Provider':
        return <div>Model-specific settings go here...</div>
      case 'Inference':
        return <>
          <InferenceNodeSetUp
            selectedNode={selectedNode}
            onUpdate={(updatedNode: EditorNodeType) => {
              nodeManager.updateMetadata(updatedNode.data.metadata)
            }}
          />
        </>
      // case 'Condition':
      //   return <>
      //     <StepNavigation />
      //   </>
      default:
        return <div>No external settings available for this node type.</div>
    }
  }

  useEffect(() => {
    console.log('selectedNode sidebar', state.editor.selectedNode.data.metadata)
  }, [state.editor.selectedNode])

  return (
    <aside>
      <Tabs
        defaultValue="actions"
        className="h-screen overflow-scroll pb-24"
      >
        <TabsList className="bg-transparent">
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <Separator />
        <TabsContent
          value="actions"
          className="flex flex-col gap-4 p-4"
        >
          {Object.entries(EditorCanvasDefaultCardTypes)
            // .filter(
            //   ([_, cardType]) =>
            //     (!nodes.length && cardType.type === 'Trigger') ||
            //     (nodes.length && cardType.type === 'Action')
            // )
            .map(([cardKey, cardValue]) => (
              <Card
                key={cardKey}
                draggable
                className="w-full cursor-grab border-black bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900"
                onDragStart={(event) =>
                  onDragStart(event, cardKey as EditorNodeSpecificTypes)
                }
              >
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                  {/* <EditorCanvasIconHelper type={cardKey as EditorCanvasTypes} /> */}
                  <CardTitle className="text-md">
                    {cardKey}
                    <CardDescription>{cardValue.description}</CardDescription>
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
        </TabsContent>
        <TabsContent
          value="settings"
          className="-mt-6"
        >
          {hasSelectedNode ? (
            <>
              <div className="px-2 py-4 text-center text-xl font-bold">
                {selectedNode.data.title} - Settings
              </div>

              <Accordion type="multiple">
                <AccordionItem
                  value="InternalConfig"
                  className="border-y-[1px] px-2"
                >
                  <AccordionTrigger className="!no-underline">
                    Internal Configuration
                  </AccordionTrigger>
                  <AccordionContent>
                    <p><strong>Description:</strong> {selectedNode.data.description}</p>
                    <p><strong>Completed:</strong> {selectedNode.data.completed ? 'Yes' : 'No'}</p>
                    <p><strong>Current:</strong> {selectedNode.data.current ? 'Yes' : 'No'}</p>
                    <p><strong>Inputs:</strong> {selectedNode.data.metadata.inputs}</p>
                    <p><strong>Outputs:</strong> {selectedNode.data.metadata.outputs}</p>

                    <h4>Input Handles</h4>
                    {(selectedNode.data.metadata.inputHandles || []).map((handle) => (
                      <Button
                        key={handle.id}
                        variant={handle.id === selectedHandle?.id ? "secondary" : "default"}
                        onClick={() => {
                          dispatch({
                            type: 'SELECTED_HANDLE',
                            payload: {
                              element: handle,
                              nodeId: selectedNode.id,
                            },
                          });
                        }}
                      >
                        {handle.id}
                      </Button>
                    ))}

                    <h4>Output Handles</h4>
                    {(selectedNode.data.metadata.outputHandles || []).map((handle) => (
                      <Button
                        key={handle.id}
                        variant={handle.id === selectedHandle?.id ? "secondary" : "default"}
                        onClick={() => {
                          dispatch({
                            type: 'SELECTED_HANDLE',
                            payload: {
                              element: handle,
                              nodeId: selectedNode.id,
                            },
                          });
                        }}
                      >
                        {handle.id}
                      </Button>
                    ))}

                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="ExternalConfig"
                  className="px-2"
                >
                  <AccordionTrigger className="!no-underline">
                    External Configuration
                  </AccordionTrigger>
                  <AccordionContent>
                    <textarea
                      readOnly
                      className="w-full p-2 border rounded mt-2 text-sm"
                      rows={4}
                      value={outputData || 'No node data available.'}
                    />
                    {renderExternalConfig(selectedNode.data.specificType)}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </>
          ) : (
            <div className="px-2 py-4 text-center text-lg">
              No node selected.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </aside>
  )
}

export default EditorCanvasSidebar
