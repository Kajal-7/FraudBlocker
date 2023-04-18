import React, { useRef, useState } from 'react'
import {
  FileUploadContainer,
  FormField,
  DragDropText,
  UploadFileBtn,
  FilePreviewContainer,
  ImagePreview,
  PreviewContainer,
  PreviewList,
  FileMetaData,
  RemoveFileIcon,
  InputLabel,
} from './file-upload.styles'

const DEFAULT_MAX_FILE_SIZE_IN_BYTES = 1000000
const KILO_BYTES_PER_BYTE = 1000

const convertBytesToKB = (bytes) => Math.round(bytes / KILO_BYTES_PER_BYTE)

const FileUpload = ({
  label,
  updateFilesCb,
  maxFileSizeInBytes = DEFAULT_MAX_FILE_SIZE_IN_BYTES,
  ...otherProps
}) => {
  const fileInputField = useRef(null)
  const [files, setFiles] = useState({})

  const handleUploadBtnClick = () => {
    fileInputField.current.click()
  }

  const addNewFiles = (newFiles) => {
    for (let file of newFiles) {
      if (file.size <= maxFileSizeInBytes) {
        if (!otherProps.multiple) {
          return { file }
        }
        files[file.name] = file
      }
    }
    return { ...files }
  }
  const convertNestedObjectToArray = (nestedObj) =>
    Object.keys(nestedObj).map((key) => nestedObj[key])

  const callUpdateFilesCb = (files) => {
    const filesAsArray = convertNestedObjectToArray(files)
    updateFilesCb(filesAsArray)
  }

  const handleNewFileUpload = (e) => {
    const { files: newFiles } = e.target
    if (newFiles.length) {
      let updatedFiles = addNewFiles(newFiles)
      setFiles(updatedFiles)
      callUpdateFilesCb(updatedFiles)
    }
  }

  const removeFile = (fileName) => {
    delete files[fileName]
    setFiles({ ...files })
    callUpdateFilesCb({ ...files })
  }

  return (
    <>
      <FileUploadContainer>
        <InputLabel style={{display: 'block'}}>{label}</InputLabel>
        <UploadFileBtn type='button' onClick={handleUploadBtnClick}>
          <i className='fas fa-file-upload' />
          <span>
            {' '}
            Upload {otherProps.multiple ? 'files' : 'a file'} (Max: 1MB)
          </span>
        </UploadFileBtn>
        <FormField
          type='file'
          ref={fileInputField}
          title=''
          value=''
          onChange={handleNewFileUpload}
          {...otherProps}
        />
      </FileUploadContainer>
      {Object.keys(files).length !== 0 && (
        <FilePreviewContainer>
          <span>To Upload</span>
          <PreviewList>
            {Object.keys(files).map((fileName, index) => {
              let file = files[fileName]
              let isImageFile = file.type.split('/')[0] === 'image'
              return (
                <PreviewContainer key={fileName}>
                  <div>
                    {isImageFile && (
                      <ImagePreview
                        src={URL.createObjectURL(file)}
                        alt={`file preview ${index}`}
                      />
                    )}
                    <FileMetaData isImageFile={isImageFile}>
                      <span>{file.name}</span>
                      <aside>
                        <span>{convertBytesToKB(file.size)} kb</span>
                        <RemoveFileIcon
                          className='fas fa-trash-alt'
                          onClick={() => removeFile(fileName)}
                        />
                      </aside>
                    </FileMetaData>
                  </div>
                </PreviewContainer>
              )
            })}
          </PreviewList>
        </FilePreviewContainer>
      )}
    </>
  )
}

export default FileUpload
