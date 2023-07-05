const handleFileSelect = (file: File) => {
  console.log("llamandose")
  if (file) {
  console.log("exist")
  loadingImage.value = true
    const reader = new FileReader()
    reader.onload = (event) => {
      console.log("en reader...")
      loadNewImageAsB64(event, 0.9)
    }
    reader.readAsDataURL(file)
  }
  return false
}

const funsionaAqui = (file) => {
  console.log('digameeeesee', file)
  return (file) => {
    console.log(file)
    console.log("llamandose")
    if (file) {
    console.log("exist")
      const reader = new FileReader()
      reader.onload = (event) => {
        console.log("en reader...")
        loadNewImageAsB64(event, 0.9)
      }
      reader.readAsDataURL(file)
    }
    return false
  }
}

const loadNewImageAsB64 = async (
  event: ProgressEvent<FileReader> | string,
  qualityImage: number,
): Promise<boolean> => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  const img = new Image()
  if (!event) return true
  if (typeof event === 'string') {
    img.src = event
  } else {
    img.src = event?.target?.result as string
  }

  return await new Promise((resolve) => {
    img.onload = function () {
      const imageResolution = 300

      const aspectRatio = img.width / img.height
      let targetWidth = img.width
      let targetHeight = img.height
      let offsetX = 0
      let offsetY = 0

      if (aspectRatio > 1) {
        targetWidth = img.height
        offsetX = (img.width - targetWidth) / 2
      } else if (aspectRatio < 1) {
        targetHeight = img.width
        offsetY = (img.height - targetHeight) / 2
      }

      canvas.width = imageResolution
      canvas.height = imageResolution

      context!.drawImage(
        img,
        offsetX,
        offsetY,
        targetWidth,
        targetHeight,
        0,
        0,
        imageResolution,
        imageResolution,
      )

      const dataURL = canvas.toDataURL('image/webp', qualityImage)
      console.log(dataURL)
      if (
        encode(
          btoa(JSON.stringify({ ...formData.value, imageProfile: dataURL })),
        ).length < 8000
      ) {
        store.updateImage(dataURL)
        resolve(true)
      } else {
        if (qualityImage < 0) {
          store.updateImage('')
          ElMessage.error('size of CV too big for sharing by URL.')
          resolve(false)
        } else {
          resolve(loadNewImageAsB64(event, qualityImage - 0.01))
        }
      }
    }
  })
}
const schema = {
  type: 'object',
  title: 'Personal Data',
  description: 'Please, add your data',
  'ui:order': ['firstName', 'LastName', '*'],
  properties: {
    images: {
      properties: {
        imgUrl: {
          title: 'titulo',
          type: 'string',
          'ui:beforeUpload': funsionaAqui(),
          'ui:action':
            'https://run.mocky.io/v3/518d7af7-204f-45ab-9628-a6e121dab8ca',
          'ui:widget': 'UploadWidget',
          'ui:btnText': 'subir foto',
        },
      },
    },

    firstName: {
      type: 'string',
      title: 'First name',
    },
    lastName: {
      type: 'string',
      title: 'Last name',
    },
    mainPositionRole: {
      type: 'string',
      title: 'Main Role Position Title',
    },
    secondaryPositionRole: {
      title: 'Secondary Position Role Title',
      type: 'string',
    },
    technicalKnowledge: {
      type: 'array',
      title: 'Technical Knowledge',
      items: {
        title: 'Knowledge',
        type: 'object',
        properties: {
          title: {
            type: 'string',
            title: 'Title',
            default: '',
          },
          enhance: {
            type: 'boolean',
            title: 'Enhance',
            default: false,
          },
        },
      },
    },
    roles: {
      type: 'array',
      title: 'Roles',
      minItems: 0,
      maxItems: 5,
      items: {
        title: 'Role title',
        type: 'string',
        'err:required': 'Role is required',
      },
    },
    hashTags: {
      type: 'array',
      title: 'Knowledge Tags',
      minItems: 0,
      maxItems: 5,
      items: {
        title: 'Tag',
        type: 'string',
        message: {
          'err:required': 'Tag name is required',
        },
      },
    },
    certificationsAwards: {
      type: 'array',
      title: 'Certifications / Awards',
      minItems: 0,
      maxItems: 5,
      items: {
        title: 'Knowledge',
        type: 'object',
        properties: {
          title: {
            type: 'string',
            title: 'Title',
            default: '',
          },
          description: {
            type: 'string',
            title: 'Description',
            default: '',
          },
        },
      },
    },
    workExperience: {
      type: 'object',
      title: 'Work Experience',
      properties: {
        newPage: {
          type: 'boolean',
          title: 'Move work experience to new page',
          default: false,
        },
        experience: {
          type: 'array',
          'ui:options': {
            showIndexNumber: true,
          },
          items: {
            title: 'Experience',
            type: 'object',
            properties: {
              timePeriod: {
                type: 'string',
                title: 'Time period',
                default: '2020 - Present',
              },
              position: {
                type: 'string',
                title: 'Position',
                default: '',
              },
              description: {
                type: 'string',
                title: 'Description',
                default: '',
              },
            },
          },
        },
      },
      items: {
        title: 'Knowledge',
        type: 'object',
        properties: {
          timePeriod: {
            type: 'string',
            title: 'Time period',
            default: '2020 - Present',
          },
          position: {
            type: 'string',
            title: 'Position',
            default: '',
          },
          description: {
            type: 'string',
            title: 'Description',
            default: '',
          },
        },
      },
    },
  },
}
export default schema
