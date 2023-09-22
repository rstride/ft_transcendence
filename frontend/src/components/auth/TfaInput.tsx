import { FormControl, FormHelperText } from '@mui/material';
import * as React from 'react';
import AuthCode, { AuthCodeRef } from 'react-auth-code-input';
import "./styles.css";

interface TfaInputProps {
    setResult: Function
    error: boolean
    AuthInputRef: React.RefObject<AuthCodeRef>
  }

export default function TfaInput({
    setResult,
    error,
    AuthInputRef
    
}: TfaInputProps) {


const handleOnChange = (res: string) => {
    setResult(res);
};

  return (
    <>
    <FormControl sx={{ m: 3 }} error={true} variant="standard">
    <AuthCode
        allowedCharacters='numeric'
        onChange={handleOnChange}
        containerClassName="container"
        inputClassName="input"
        ref={AuthInputRef}
    />
        {error? <FormHelperText>Code invalid</FormHelperText>: ''}
    </FormControl>
    </>
  )
}