export function actionSuccess(message: string) {
  return {
    success: true,
    message,
  };
}

export function actionError(message: string) {
  return {
    success: false,
    message,
  };
}
