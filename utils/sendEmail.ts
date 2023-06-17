import emailjs from '@emailjs/browser';

export const sendEmailReminder = (
  emailMessage: string,
  studentInfo: any,
  setShowToast?: any,
  alert?: any
) => {
  const content = {
    to_name: studentInfo.name,
    to_email: studentInfo.email,
    message: emailMessage
  };
  emailjs
    .send(
      process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID ?? '',
      process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID ?? '',
      content,
      process.env.NEXT_PUBLIC_EMAIL_PUBLIC_KEY ?? ''
    )
    .then(
      (result) => {
        console.log(result.text);
        if (alert) {
          alert();
        }
        if (setShowToast) {
          setShowToast(true);
          setTimeout(() => {
            setShowToast(false);
          }, 3000);
        }
      },
      (error) => {
        console.log(error.text);
      }
    );
};
