import stripesFinalForm from '@folio/stripes/final-form';

export const StripesFinalFormHelper = ({ formOptions = {}, ...props }) => {
  const Form = stripesFinalForm(formOptions)(({ children, handleSubmit }) => {
    return <form onSubmit={handleSubmit}>{children}</form>;
  });

  return <Form {...props} />;
};
