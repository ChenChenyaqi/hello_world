// 压缩前将file转换成img对象
function readImg(file) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        const reader = new FileReader()
        reader.onload = function(e) {
            img.src = e.target.result
        }
        reader.onerror = function(e) {
            reject(e)
        }
        reader.readAsDataURL(file)
        img.onload = function() {
            resolve(img)
        }
        img.onerror = function(e) {
            reject(e)
        }
    })
}

/**
 * 压缩图片
 *@param img 被压缩的img对象
 * @param type 压缩后转换的文件类型
 * @param mx 触发压缩的图片最大宽度限制
 * @param mh 触发压缩的图片最大高度限制
 */
function compressImg(img, type, mx, mh) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        const { width: originWidth, height: originHeight } = img
        // 最大尺寸限制
        const maxWidth = mx
        const maxHeight = mh
        // 目标尺寸
        let targetWidth = originWidth
        let targetHeight = originHeight
        if (originWidth > maxWidth || originHeight > maxHeight) {
            if (originWidth / originHeight > 1) {
                // 宽图片
                targetWidth = maxWidth
                targetHeight = Math.round(maxWidth * (originHeight / originWidth))
            } else {
                // 高图片
                targetHeight = maxHeight
                targetWidth = Math.round(maxHeight * (originWidth / originHeight))
            }
        }
        canvas.width = targetWidth
        canvas.height = targetHeight
        context.clearRect(0, 0, targetWidth, targetHeight)
        // 图片绘制
        context.drawImage(img, 0, 0, targetWidth, targetHeight)
        canvas.toBlob(function(blob) {
            resolve(blob)
        }, type || 'image/png') })
}

export default async function compressImage(file){
    const img = await readImg(file)
    const blob = await compressImg(img, file.type, 1000, 1000)
    return blob
}

