import { forwardRef, useImperativeHandle, useState, useRef } from 'react'
import './TextInputMovingLabel.css'

interface timlProps {
    type: string
    id: string
    autoComplete: string
    labelText: string
    validateInput: (id: string) => void
}

export interface TIMLHandle {
    getInput: () => string
    setError: (errorMsg: string) => void
}

const TextInputMovingLabel = forwardRef<TIMLHandle, timlProps>(({ type, id, autoComplete, labelText, validateInput }, ref) => {

    const inputRef = useRef<HTMLInputElement | null>(null);
    const [errorText, setErrorText] = useState<string>('');

    useImperativeHandle(ref, () => ({

        getInput: () => {
            if (!inputRef.current) throw new Error("inputRef not detected");
            return inputRef.current.value;
        },

        setError: (errorMsg: string) => {
            setErrorText(errorMsg);
        }
    }));

    const handleInputFocus = () => {
        // Clear and thus hiding the error message when user is typing to correct it
        setErrorText('');
    }

    const handleInputBlur = () => {
        // Start validation for this input
        validateInput(id);
    }

    return (
        <div className='timlDiv'>
            <input ref={inputRef} className='timlInput' type={type} id={id} autoComplete={autoComplete} placeholder='  ' spellCheck='false' autoCapitalize='false' autoCorrect='false' onFocus={handleInputFocus} onBlur={handleInputBlur}></input>
            <label className='timlLabel' htmlFor={id}>{labelText}</label>
            {errorText !== '' && (<p className='timlError'>{errorText}</p>)}
        </div>
    )
});

export default TextInputMovingLabel