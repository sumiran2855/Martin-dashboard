interface InputFieldProps {
    label: string;
    name?: string;
    type?: string;
    formikKey: string;
    formikProps?: any;
  }
  
  export const InputField = ({ label, type, formikKey, formikProps }: InputFieldProps) => (
    <>
      <input
        type={type}
        placeholder={label}
        className="w-full px-4 py-3 mb-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        {...formikProps.getFieldProps(formikKey)}
      />
      {formikProps.touched[formikKey] && formikProps.errors[formikKey] && (
        <p className="text-red-500 text-sm mb-3">
          {formikProps.errors[formikKey]}
        </p>
      )}
    </>
  );
  
  