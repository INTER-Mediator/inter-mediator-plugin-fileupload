/*
 * INTER-Mediator
 * Copyright (c) INTER-Mediator Directive Committee (http://inter-mediator.org)
 * This project started at the end of 2009 by Masayuki Nii msyk@msyk.net.
 *
 * INTER-Mediator is supplied under MIT License.
 * Please see the full license for details:
 * https://github.com/INTER-Mediator/INTER-Mediator/blob/master/dist-docs/License.txt
 */

// JSHint support
/* global IMLibContextPool, INTERMediator, IMLibMouseEventDispatch, IMLibLocalContext,
 IMLibChangeEventDispatch, INTERMediatorLib, INTERMediator_DBAdapter, IMLibQueue, IMLibCalc, IMLibUI,
 IMLibEventResponder, INTERMediatorLog, SHA1, jsSHA, IMLib, INTERMediatorOnPage */
/* jshint -W083 */ // Function within a loop

/**
 * @fileoverview IMParts_Catalog class is defined here.
 */
/**
 *
 * Usually you don't have to instanciate this class with new operator.
 * @constructor
 */
const IMParts_Catalog = {}

IMParts_Catalog.fileupload = {
  html5DDSuported: false,
  progressSupported: false, // see http://www.johnboyproductions.com/php-upload-progress-bar/
  forceOldStyleForm: false,
  uploadButtonLabel: '送信',
  uploadCancelButtonLabel: 'キャンセル',
  uploadId: 'sign' + Math.random(),

  instanciate: function (parentNode) {
    'use strict'
    var inputNode, formNode, buttonNode, hasTapEvent
    var newId = parentNode.getAttribute('id') + '-e'
    var newNode = document.createElement('DIV')
    IMLibLocalContext.setValue('uploadFileSelect', 'false')
    INTERMediatorLib.setClassAttributeToNode(newNode, '_im_fileupload')
    newNode.setAttribute('id', newId)
    this.ids.push(newId)
    if (this.forceOldStyleForm || (INTERMediator.isEdge && INTERMediator.ieVersion < 14)) {
      this.html5DDSuported = false
    } else {
      if (window.FileReader && window.FormData) {
        // Checking to exists both of classes.
        this.html5DDSuported = true
      } else {
        this.html5DDSuported = false
      }
    }
    hasTapEvent = ('ontouchstart' in window)
    if (hasTapEvent) {
      this.html5DDSuported = false
    }
    var autoReload = (parentNode.getAttribute('data-im-widget-reload') !== null) ? parentNode.getAttribute('data-im-widget-reload') : false
    newNode.setAttribute('data-im-widget-reload', autoReload)
    if (this.html5DDSuported) {
      newNode.dropzone = 'copy'
      var widgetStyle = (parentNode.getAttribute('data-im-widget-style') === 'false') ? false : true
      if (widgetStyle) {
        newNode.style.width = '200px'
        newNode.style.height = '100px'
        newNode.style.paddingTop = '20px'
        newNode.style.backgroundColor = '#AAAAAA'
        newNode.style.border = '3px dotted #808080'
        newNode.style.textAlign = 'center'
        newNode.style.fontSize = '75%'
        var eachLine = INTERMediatorOnPage.getMessages()[3101].split(/\n/)
        for (var i = 0; i < eachLine.length; i += 1) {
          if (i > 0) {
            newNode.appendChild(document.createElement('BR'))
          }
          newNode.appendChild(document.createTextNode(eachLine[i]))
        }
      }
    } else {
      formNode = document.createElement('FORM')
      formNode.className = '_im_fileupload_form'
      formNode.setAttribute('method', 'post')
      formNode.setAttribute('action', INTERMediatorOnPage.getEntryPath() + '?access=uploadfile')
      formNode.setAttribute('enctype', 'multipart/form-data')
      var divNode = document.createElement('DIV')
      divNode.className = '_im_fileupload_form_wrapper form-wrapper'
      divNode.appendChild(formNode)
      newNode.appendChild(divNode)

      if (this.progressSupported) {
        inputNode = document.createElement('INPUT')
        inputNode.setAttribute('type', 'hidden')
        inputNode.setAttribute('name', 'APC_UPLOAD_PROGRESS')
        inputNode.setAttribute('id', 'progress_key')
        inputNode.setAttribute('value',
          this.uploadId + (this.ids.length - 1))
        formNode.appendChild(inputNode)
      }

      inputNode = document.createElement('INPUT')
      inputNode.setAttribute('type', 'hidden')
      inputNode.setAttribute('name', '_im_redirect')
      inputNode.setAttribute('value', location.href)
      formNode.appendChild(inputNode)

      inputNode = document.createElement('INPUT')
      inputNode.setAttribute('type', 'hidden')
      inputNode.setAttribute('name', '_im_contextnewrecord')
      inputNode.setAttribute('value', 'uploadfile')
      formNode.appendChild(inputNode)

      inputNode = document.createElement('INPUT')
      inputNode.setAttribute('type', 'hidden')
      inputNode.setAttribute('name', 'access')
      inputNode.setAttribute('value', 'uploadfile')
      formNode.appendChild(inputNode)

      inputNode = document.createElement('INPUT')
      inputNode.setAttribute('type', 'file')
      inputNode.setAttribute('accept', '*/*')
      inputNode.setAttribute('name', '_im_uploadfile')
      inputNode.className = '_im_uploadfile'
      inputNode.addEventListener('change', function () {
        if (this.files[0].size > 0) {
          this.nextSibling.removeAttribute('disabled')
        }
      }, false)
      formNode.appendChild(inputNode)

      var cancelButtonWrapper, cancelButton
      cancelButtonWrapper = document.createElement('DIV')
      cancelButtonWrapper.className = '_im_fileupload_cancel_button_wrapper'
      cancelButton = document.createElement('BUTTON')
      cancelButton.className = '_im_fileupload_cancel_button'
      cancelButton.appendChild(document.createTextNode(this.uploadCancelButtonLabel))
      cancelButtonWrapper.appendChild(cancelButton)

      buttonNode = document.createElement('BUTTON')
      buttonNode.className = '_im_fileupload_button'
      buttonNode.setAttribute('type', 'submit')
      buttonNode.setAttribute('disabled', '')
      buttonNode.appendChild(document.createTextNode(this.uploadButtonLabel))
      if (!newNode.id) {
        newNode.id = INTERMediator.nextIdValue()
      }
      IMLibMouseEventDispatch.setExecute(newNode.id, function () {
        var node = document.getElementById(newNode.id)
        if (node !== null && node.children.length > 0) {
          if (node.children[0].style.display === 'none' || node.children[0].style.display === '') {
            node.children[0].style.display = 'flex'
            node.children[0].style.display = '-webkit-flex'
          }
        }
      }, true)
      if (!cancelButtonWrapper.id) {
        cancelButtonWrapper.id = INTERMediator.nextIdValue()
      }
      IMLibMouseEventDispatch.setExecute(cancelButtonWrapper.id, function () {
        this.parentNode.style.display = 'none'
      })
      divNode.appendChild(cancelButtonWrapper)
      formNode.appendChild(buttonNode)
      this.formFromId[newId] = formNode
    }
    if (parentNode.getAttribute('data-im-widget-inner') === 'true') {
      var children = parentNode.children
      for (var c = children.length - 1; c >= 0; c--) {
        newNode.appendChild(children[c])
      }
    }
    parentNode.appendChild(newNode)

    newNode._im_getValue = function () {
      var targetNode = newNode
      return targetNode.value
    }
    parentNode._im_getValue = function () {
      var targetNode = newNode
      return targetNode.value
    }
    parentNode._im_getComponentId = function () {
      var theId = newId
      return theId
    }

    // parentNode._im_setValue = function (str) {
    //     var targetNode = newNode
    //     if (this.html5DDSuported) {
    //         //    targetNode.innerHTML = str
    //     }
    // }
  },
  ids: [],
  formFromId: {},
  finish: function () {
    'use strict'
    var shaObj, hmacValue, targetNode, formNode, i, tagetIdLocal, isProgressingLocal, serialIdLocal, uploadIdLocal
    let encrypt = new JSEncrypt()

    if (this.html5DDSuported) {
      for (i = 0; i < this.ids.length; i += 1) {
        tagetIdLocal = this.ids[i]
        targetNode = document.getElementById(tagetIdLocal)
        if (targetNode) {
          INTERMediatorLib.addEvent(targetNode, 'dragleave', function (event) {
            event.preventDefault()
            event.target.style.backgroundColor = '#AAAAAA'
          })
          INTERMediatorLib.addEvent(targetNode, 'dragover', function (event) {
            event.preventDefault()
            event.target.style.backgroundColor = '#AADDFF'
          })
          isProgressingLocal = this.progressSupported
          serialIdLocal = this.ids.length
          uploadIdLocal = this.uploadId
          INTERMediatorLib.addEvent(targetNode, 'drop', (function () {
            var iframeId = i
            var isProgressing = isProgressingLocal
            var serialId = serialIdLocal
            var uploadId = uploadIdLocal
            var tagetId = tagetIdLocal
            return function (event) {
              var file, fileNameNode, i, updateInfo, infoFrame
              event.preventDefault()
              var eventTarget = event.currentTarget
              if (isProgressing) {
                infoFrame = document.createElement('iframe')
                infoFrame.setAttribute('id', 'upload_frame' + serialId)
                infoFrame.setAttribute('name', 'upload_frame')
                infoFrame.setAttribute('frameborder', '0')
                infoFrame.setAttribute('border', '0')
                infoFrame.setAttribute('scrolling', 'no')
                infoFrame.setAttribute('scrollbar', 'no')
                infoFrame.style.width = '100%'
                infoFrame.style.height = '24px'
                eventTarget.appendChild(infoFrame)
              }
              for (i = 0; i < event.dataTransfer.files.length; i += 1) {
                file = event.dataTransfer.files[i]
                fileNameNode = document.createElement('DIV')
                fileNameNode.appendChild(document.createTextNode(
                  INTERMediatorOnPage.getMessages()[3102] + file.name))
                fileNameNode.style.marginTop = '20px'
                fileNameNode.style.backgroundColor = '#FFFFFF'
                fileNameNode.style.textAlign = 'center'
                event.target.appendChild(fileNameNode)
              }
              updateInfo = IMLibContextPool.getContextInfoFromId(eventTarget.getAttribute('id'), '')
              if (isProgressing) {
                if (infoFrame) {
                  infoFrame.style.display = 'block'
                }
                setTimeout((function () {
                  var frameNode = infoFrame
                  var param = uploadId + iframeId
                  return function () {
                    if (frameNode) {
                      frameNode.setAttribute('src',
                        'upload_frame.php?up_id=' + param)
                    }
                  }
                })())
              }
              IMLibQueue.setTask((function () {
                var uploadData = '&_im_contextname=' + encodeURIComponent(updateInfo.context.contextName) +
                  '&_im_field=' + encodeURIComponent(updateInfo.field) +
                  '&_im_keyfield=' + encodeURIComponent(updateInfo.record.split('=')[0]) +
                  '&_im_keyvalue=' + encodeURIComponent(updateInfo.record.split('=')[1]) +
                  '&_im_contextnewrecord=' + encodeURIComponent('uploadfile') +
                  (isProgressing ? ('&APC_UPLOAD_PROGRESS=' + encodeURIComponent(uploadId + iframeId)) : '')
                var uploadSpec = {
                  fileName: file.name,
                  content: file
                }
                var contextName = updateInfo.context.contextName
                var updateField = updateInfo.field
                var targetIdCapt = tagetId
                var targetNodeCapt = targetNode
                var finishFunc = (function () {
                  var infoFrameCapt = infoFrame
                  var fileNameNodeCapt = fileNameNode
                  return function () {
                    if (infoFrameCapt) {
                      infoFrameCapt.setAttribute('src', '')
                    }
                    if (fileNameNodeCapt) {
                      fileNameNodeCapt.parentNode.removeChild(fileNameNodeCapt)
                    }
                  }
                })()
                return function (completeTask) {
                  INTERMediator_DBAdapter.uploadFile(
                    uploadData, uploadSpec,
                    function (dbresult) {
                      var contextObj, contextInfo
                      let contextObjects = null
                      let fvalue, i, context
                      let relatedContextName = ''
                      let index
                      context = IMLibContextPool.getContextDef(contextName)
                      if (context['file-upload']) {
                        for (index in context['file-upload']) {
                          if (context['file-upload'][index].field === updateField) {
                            relatedContextName = context['file-upload'][index].context
                            break
                          }
                        }
                        fvalue = IMLibContextPool.getKeyFieldValueFromId(targetIdCapt, '')
                        contextObjects = IMLibContextPool.getContextsFromNameAndForeignValue(
                          relatedContextName, fvalue, context.key)
                      } else {
                        contextObjects = IMLibContextPool.getContextFromName(contextName)
                      }
                      contextInfo = IMLibContextPool.getContextInfoFromId(targetIdCapt, '')
                      contextInfo.context.setValue(contextInfo.record, contextInfo.field, dbresult)
                      if (contextObjects) {
                        for (i = 0; i < contextObjects.length; i += 1) {
                          contextObj = contextObjects[i]
                          INTERMediator.construct(contextObj)
                        }
                      }
                      INTERMediatorLog.flushMessage()
                      if (targetNodeCapt.getAttribute('data-im-widget-reload') === 'true') {
                        INTERMediator.construct()
                      }
                      event.target.style.backgroundColor = '#AAAAAA'
                      finishFunc()
                      completeTask()
                    },
                    function () {
                      event.target.style.backgroundColor = '#AAAAAA'
                      finishFunc()
                      completeTask()
                    })
                }
              })())
            }
          })())
        }
      }
    } else {
      for (i = 0; i < this.ids.length; i += 1) {
        targetNode = document.getElementById(this.ids[i])
        formNode = targetNode.getElementsByTagName('FORM')[0]
        if (targetNode && formNode) {
          var updateInfo = IMLibContextPool.getContextInfoFromId(this.ids[i], '')
          //= INTERMediator.updateRequiredObject[IMParts_im_fileupload.ids[i]]
          var inputNode = document.createElement('INPUT')
          inputNode.setAttribute('type', 'hidden')
          inputNode.setAttribute('name', '_im_contextname')
          inputNode.setAttribute('value', updateInfo.context.contextName)
          formNode.appendChild(inputNode)

          inputNode = document.createElement('INPUT')
          inputNode.setAttribute('type', 'hidden')
          inputNode.setAttribute('name', '_im_field')
          inputNode.setAttribute('value', updateInfo.field)
          formNode.appendChild(inputNode)

          inputNode = document.createElement('INPUT')
          inputNode.setAttribute('type', 'hidden')
          inputNode.setAttribute('name', '_im_keyfield')
          inputNode.setAttribute('value', updateInfo.record.split('=')[0])
          formNode.appendChild(inputNode)

          inputNode = document.createElement('INPUT')
          inputNode.setAttribute('type', 'hidden')
          inputNode.setAttribute('name', '_im_keyvalue')
          inputNode.setAttribute('value', updateInfo.record.split('=')[1])
          formNode.appendChild(inputNode)

          inputNode = document.createElement('INPUT')
          inputNode.setAttribute('type', 'hidden')
          inputNode.setAttribute('name', 'clientid')
          if (INTERMediatorOnPage.authUser.length > 0) {
            inputNode.value = INTERMediatorOnPage.clientId
          }
          formNode.appendChild(inputNode)
          inputNode = document.createElement('INPUT')
          inputNode.setAttribute('type', 'hidden')
          inputNode.setAttribute('name', 'authuser')
          if (INTERMediatorOnPage.authUser.length > 0) {
            inputNode.value = INTERMediatorOnPage.authUser
          }
          formNode.appendChild(inputNode)
          inputNode = document.createElement('INPUT')
          inputNode.setAttribute('type', 'hidden')
          inputNode.setAttribute('name', 'response')
          if (INTERMediatorOnPage.authUser.length > 0) {
            if (INTERMediatorOnPage.authHashedPassword && INTERMediatorOnPage.authChallenge) {
              shaObj = new jsSHA('SHA-256', 'TEXT')
              shaObj.setHMACKey(INTERMediatorOnPage.authChallenge, 'TEXT')
              shaObj.update(INTERMediatorOnPage.authHashedPassword)
              hmacValue = shaObj.getHMAC('HEX')
              inputNode.value = hmacValue
            } else {
              inputNode.value = 'dummy'
            }
          }
          formNode.appendChild(inputNode)

          if (INTERMediatorOnPage.authUser.length > 0) {
            encrypt.setPublicKey(INTERMediatorOnPage.publickey)
            inputNode = document.createElement('INPUT')
            inputNode.setAttribute('type', 'hidden')
            inputNode.setAttribute('name', 'cresponse')
            inputNode.setAttribute('value',
              encrypt.encrypt(
                INTERMediatorOnPage.authCryptedPassword.substr(0, 220) +
                IMLib.nl_char + INTERMediatorOnPage.authChallenge) +
                IMLib.nl_char + INTERMediatorOnPage.authCryptedPassword.substr(220))
            formNode.appendChild(inputNode)
          }

          if (this.progressSupported) {
            inputNode = document.createElement('iframe')
            inputNode.setAttribute('id', 'upload_frame' + i)
            inputNode.setAttribute('name', 'upload_frame')
            inputNode.setAttribute('frameborder', '0')
            inputNode.setAttribute('border', '0')
            inputNode.setAttribute('scrolling', 'no')
            inputNode.setAttribute('scrollbar', 'no')
            formNode.appendChild(inputNode)

            INTERMediatorLib.addEvent(formNode, 'submit', (function () {
              var iframeId = i
              return function () {
                var iframeNode = document.getElementById('upload_frame' + iframeId)
                iframeNode.style.display = 'block'
                setTimeout(function () {
                  var infoURL = selfURL() + '?uploadprocess=' + this.uploadId + iframeId
                  iframeNode.setAttribute('src', infoURL)
                })
                return true
              }
            })())
          }
        }
      }
    }
    this.ids = []
    this.formFromId = {}

    function selfURL () {
      var nodes = document.getElementsByTagName('SCRIPT')
      for (var i = 0; i < nodes.length; i += 1) {
        var srcAttr = nodes[i].getAttribute('src')
        if (srcAttr.match(/\.php/)) {
          return srcAttr
        }
      }
      return null
    }
  }
}
