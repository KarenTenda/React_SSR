import EditorProvider from '@/providers/editor-provider'
import React from 'react'
import GraphBuilderEditor from './_components/EditorCanvas'

type Props = {}

const page = (props: Props) => {
  return (
    <div > {/*className='h-full '*/}
      <EditorProvider>
        <GraphBuilderEditor />
      </EditorProvider>
    </div>
  )
}

export default page