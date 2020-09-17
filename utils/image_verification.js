export const imageFormatIsCorrect = (
  file,
  acceptType,
  errorInfo,
  imageMaxSize,
  feedback
) => {
  let isCorrectSuffix = false;
  acceptType.forEach(item => {
    file.type === `image/${item}` && (isCorrectSuffix = true);
  });
  const isOverstep = imageMaxSize - file.size / 1024 > 1;

  if (!isCorrectSuffix) {
    feedback(`上传图片只能是${errorInfo}格式！`)
    return false
  }

  if (!isOverstep) {
    setTimeout(() => {
      feedback(`上传图片大小不能超过 ${imageMaxSize}kb！`)
    }, 200);
    return false
  }
  return isCorrectSuffix && isOverstep;
};

