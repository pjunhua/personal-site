import { forwardRef, useImperativeHandle, useState, useRef } from 'react'
import './TextInputMovingLabel.css'

interface timlProps {
    type?: string
    id: string
    autoComplete?: string
    labelText: string
    validateInput?: (id: string) => void
    liveUpdate?: (input: string) => void
}

export interface TIMLHandle {
    getInput: () => string
    setInput: (input: string) => void
    setError: (errorMsg: string) => void
}

// forwardRef allows the use of useImperativeHandle
const TextInputMovingLabel = forwardRef<TIMLHandle, timlProps>(({ type, id, autoComplete, labelText, validateInput, liveUpdate }, ref) => {

    const inputRef = useRef<HTMLInputElement | null>(null);
    const [errorText, setErrorText] = useState<string>('');

    const getInput = () => {
        if (!inputRef.current) throw new Error("inputRef not detected at get input");
        return inputRef.current.value;
    }

    const setInput = (input: string) => {
        if (!inputRef.current) throw new Error("inputRef not detected at set input");
        inputRef.current.value = input;

        // Need to trigger it manually because setting the value for some reason doesn't trigger the onChange event
        handleInputChange();
    }

    const setError = (errorMsg: string) => {
        setErrorText(errorMsg);
    }

    // Allows parent component to access these, usually only the child can invoke a parent's function
    useImperativeHandle(ref, () => ({

        getInput,

        setInput,

        setError
    }));

    const handleInputFocus = () => {
        // Clear and thus hiding the error message when user is typing to correct it
        setErrorText('');
    }

    const handleInputBlur = () => {
        if (validateInput) {
            // Start validation for this input
            validateInput(id);
        }
    }

    const handleInputChange = () => {
        if (inputRef.current) {
            if (liveUpdate) {
                liveUpdate(inputRef.current.value);
            }
        }
    }

    return (
        <div className='timl'>
            <div className='timlDiv'>
                <input ref={inputRef} className='timlInput' type={type} id={id} autoComplete={autoComplete} placeholder='  ' spellCheck='false' autoCapitalize='false' autoCorrect='false' onFocus={handleInputFocus} onBlur={handleInputBlur} onChange={handleInputChange}></input>
                <label className='timlLabel' htmlFor={id}>{labelText}</label>
                <div className='inputClearButton' onMouseDown={(e)=>e.preventDefault()} onClick={()=>{setInput(''); setErrorText('');}}></div>
            </div>
            {errorText !== '' && (<p className='timlError'>{errorText}</p>)}
        </div>
    )
});

export default TextInputMovingLabel