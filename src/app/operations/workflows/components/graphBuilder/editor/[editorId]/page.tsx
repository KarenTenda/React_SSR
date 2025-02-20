"use client";
// import EditorProvider from '@/providers/editor-provider'
import React from 'react'
// import GraphBuilderEditor from './_components/EditorCanvas'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"; // Import ShadCN Breadcrumb
import { useSearchParams } from 'next/navigation'
// import GraphBuilderPlaygroundEditor, { PlaygroundEditorProvider } from './playground';
import PlaygroundExtEditor, { PlaygroundExtEditorProvider } from './playground_ext';

type Props = {}

function EditorPage(props: Props) {
  const searchParams = useSearchParams()
  const graphProps = searchParams.get('graphProps')
  const editorName = graphProps ? JSON.parse(graphProps).name : null

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50 dark:bg-gray-800">
      <div className="sticky top-0 bg-gray-50 dark:bg-gray-800 z-10 py-4 px-6 shadow-md">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/operations/workflows">Workflows</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="text-gray-500 dark:text-gray-400">
                Editor Page
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h2 className="text-xl font-bold text-center mt-2 text-gray-900 dark:text-white">
          {editorName ? `Edit ${editorName}` : 'Create a new workflow to get started'}

        </h2>
      </div>
      {/* <EditorProvider>
        <GraphBuilderEditor />
      </EditorProvider> */}

      {/* <PlaygroundEditorProvider>
      <GraphBuilderPlaygroundEditor/>
      </PlaygroundEditorProvider> */}

      <div className="flex-1 overflow-hidden">
        <PlaygroundExtEditorProvider>
          <PlaygroundExtEditor />
        </PlaygroundExtEditorProvider>
      </div>

    </div>
  )
}

export default EditorPage