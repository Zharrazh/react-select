import "./Multiselect.scss"
import cn from "classnames"

import React, {ChangeEvent, FunctionComponent, useCallback, useEffect, useRef, useState} from "react";


export type Option = {
    readonly title: string
}

type MultiselectProps = {
    readonly options : Option[]
}

export const Multiselect : FunctionComponent<MultiselectProps> = props => {



    const [isExpanded, setExpanded] = useState<boolean>(false)
    const [selectedOptions, setSelectedOptions] = useState<Option[]>([])
    const [query, setQuery] = useState<string>("")
    const [isFocused,setFocused] = useState<boolean>(false)
    const [checkOutsideClicks, setCheckOutsideClicks] = useState<boolean>(false)
    const [dropZones,setDropZones] = useState< React.RefObject<HTMLDivElement>[]> ([])
    const [draggableItem,setDraggableItem] = useState<Option|null> (null)
    const [isDraggingNow, setDraggingNow] = useState<boolean>(false)

    const inputText = useRef<HTMLInputElement>(null)

    const unselectedOptions = props.options.filter(option =>{
        return (!selectedOptions.includes(option))
    })
    let showedOptions: Option[]
    if(query===""){
        showedOptions=unselectedOptions;
    }
    else{
        showedOptions=unselectedOptions.filter(o=>{
            return o.title.indexOf(query)!==-1
        })
    }


    const createOnClickListItemCallback = (option:Option) => () =>{
        setSelectedOptions([...selectedOptions, option])
        inputText.current!.focus()
    }
    const createOnDeleteClickSelectedItemCallback = (option:Option) => () =>{
        setSelectedOptions(selectedOptions.filter(o=>o!==option))
        inputText.current!.focus()
    }
    const createOnDragStartItemCallback = (option:Option) => {
        return () => {
            setDraggableItem(option)
            setDraggingNow(true)
        }
    }
    const createOnDropItemCallback = (option:Option) => () => {
        //Удаляем из списка перетаскиваемый элемент
        let newSelectedOptions = selectedOptions.filter(o=>o!==draggableItem)
        //Находим индекс элемента перед которым нужно вставить item
        let inputIndex = selectedOptions.indexOf(option)
        //Вставляем перед ним
        newSelectedOptions.splice(inputIndex,0,draggableItem!)
        setSelectedOptions(newSelectedOptions)

        setDraggingNow(false)
    }

    const handleOnDropItemLast = () => {
        let newSelectedOptions = [...selectedOptions.filter(o=>o!==draggableItem), draggableItem!]
        setSelectedOptions(newSelectedOptions)
    }

    const handleDeleteAll = () => {
        setSelectedOptions([])
        inputText.current!.focus()
    }
    const handleToggleExpand= () => {
        setExpanded(!isExpanded)
        inputText.current!.focus()
    }
    const handleChangeQuery = (event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.currentTarget.value)
        if(!isExpanded) setExpanded(true)
    }

    const handleOnMultiselectClick = () => {
        if(!checkOutsideClicks) setCheckOutsideClicks(true)
    }

    const handleInputClick = () => {
        setExpanded(!isExpanded)
    }
    let focusTimer:NodeJS.Timer
    const handleOnFocus = () => {
        clearTimeout(focusTimer)
        if(!isFocused) {
            console.log("set focused true")
            setFocused(true)
        }
    }
    const handleOnBlur = () => {
        focusTimer = setTimeout(()=>{
            if (isFocused) setFocused(false)
            if (isExpanded) setExpanded(false)
            console.log("set focused false")
        },0)
    }

    const registerDropzone = useCallback((node:React.RefObject<HTMLDivElement>) => {
        setDropZones(dropZones=>[...dropZones, node])
    },[])

    return (
        <div className={"multiselect"} onClick={handleOnMultiselectClick}>
            <div className={cn("multiselect__select", {"focused":isFocused})} onFocus={handleOnFocus} onBlur={handleOnBlur} tabIndex={0}>
                <div className="multiselect__select__input">
                    {selectedOptions.map(option => {
                        return <SelectedOptionItem option={option}
                                                   onDeleteClick={createOnDeleteClickSelectedItemCallback(option)}
                                                   registerDropzone={registerDropzone}
                                                   dropZones={dropZones}
                                                   onDropItem={createOnDropItemCallback(option)}
                                                   onDragStart={createOnDragStartItemCallback(option)}
                        />
                    })}
                    <Dropzone isDraggingNow={isDraggingNow} onDropItem={handleOnDropItemLast}/>
                    <input type="text" placeholder={"Select..."} onInput={handleChangeQuery} onClick={handleInputClick} ref={inputText} />
                </div>
                <div className="multiselect__select__controls">
                    <DeleteAllBtn onClick={handleDeleteAll}/>
                    <div className="multiselect__select__controls__separator"/>
                    <ExpandListBtn onClick={handleToggleExpand}/>
                </div>

            </div>
            {isExpanded && showedOptions.length!==0 && <div className="multiselect__list" onFocus={handleOnFocus} onBlur={handleOnBlur} tabIndex={0}>
                {showedOptions.map(opinion => {
                    return <OptionListItem option={opinion} onClick={createOnClickListItemCallback(opinion)} key={opinion.title} />
                })}
            </div>}

        </div>
    )
}


//Это кнопочка удаления всех выбранных итемов
type DeleteAllBtnProps = {
    onClick:()=>void;
}
const DeleteAllBtn: FunctionComponent<DeleteAllBtnProps> = ({onClick}) => {
    return ( <div className={"deleteAllBtn"} onClick={onClick}>
        <i className="fas fa-times"/>
    </div> )
}


//Это кнопочка расширения селекта (может быть и не стоило выносить в отдельный элемент)
type ExpandListBtnProps = {
    onClick:()=>void;
}
const ExpandListBtn: FunctionComponent<ExpandListBtnProps> = ({onClick}) => {
    return(
        <div className={"expandListBtn"} onClick={onClick}>
            <i className="fas fa-angle-down"/>
        </div>
    )
}


// Это элемент из выпадающего списка
type OptionListItemProps = {
    readonly option:Option;
    onClick:() => void;
}
const OptionListItem: FunctionComponent<OptionListItemProps> = ({option,onClick}) =>{
    return <div className={"optionListItem"} onClick={onClick}>
        <div className="optionListItem__title">{option.title}</div>
    </div>
}

//Это иконочка выбраного итема
type SelectedOptionItemProps = {
    option: Option;
    onDeleteClick: () => void;
    dropZones: React.RefObject<HTMLDivElement>[];
    registerDropzone: (node:React.RefObject<HTMLDivElement>) => void;
    onDropItem: () => void;
    onDragStart: () => void;
}
const SelectedOptionItem : FunctionComponent<SelectedOptionItemProps> = ({option,onDeleteClick ,dropZones,registerDropzone, onDropItem, onDragStart}) => {
    const dropZoneRef = useRef<HTMLDivElement>(null)
    const itemRef  =useRef<HTMLDivElement> (null)
    useEffect(()=>{
        registerDropzone(dropZoneRef)
        console.log("register dropzone")
    },[registerDropzone])

    const handleOnDragStart =  () => {
        onDragStart()
        setTimeout(()=>{
            itemRef.current!.classList.add("hidden")
            dropZones.forEach(dz=> {
                if(dz.current) dz.current.classList.add("overed")
            })
        },0)
    }
    const handleOnDragEnd =  () => {
        setTimeout(()=>{
            itemRef.current!.classList.remove("hidden")
            dropZones.forEach(dz=> {
                if(dz.current)dz.current.classList.remove("overed")
            })
        },0)
    }

    const handleOnDragOver = (event:any) => {
        event.preventDefault()
    }

    const handleOnDragEnter = () => {
        dropZoneRef.current!.classList.add("showed")
    }
    const handleOnDragLeave = () => {
        dropZoneRef.current!.classList.remove("showed")
    }

    const handleOnDropItem = () =>{
        onDropItem()
        dropZoneRef.current!.classList.remove("showed")
    }


    return <div className={"selectedOptionWrapper"}>
        <div className={"selectedOptionDropZone"} ref={dropZoneRef}
             onDragEnter={handleOnDragEnter} onDragLeave={handleOnDragLeave}
             onDragOver={handleOnDragOver} onDrop={handleOnDropItem}/>
        <div className={"selectedOptionItem"} ref={itemRef} draggable={true} onDragStart={handleOnDragStart} onDragEnd={handleOnDragEnd} >
            <div className="selectedOptionItem__title">{option.title}</div>
            <div className="selectedOptionItem__deleteBtn" onClick={onDeleteClick}>
                <i className="fas fa-times"/>
            </div>
        </div>
    </div>
}

type DropzoneProps = {
    isDraggingNow:boolean
    onDropItem: () => void;
}
const Dropzone:FunctionComponent<DropzoneProps> = ({ onDropItem, isDraggingNow}) => {
    const [isDisplay, setDisplay] = useState<boolean>(false)

    const handleOnDragOver = (event:any) => {
        event.preventDefault()
    }
    const handleOnDragEnter = () => {
        if (!isDisplay) setDisplay(true)
    }
    const handleOnDragLeave = () => {
        if (isDisplay) setDisplay(false)
    }
    const handleOnDrop= () =>{
        onDropItem()
        if (isDisplay) setDisplay(false)
    }

    return  <div className={cn("dropZoneWrapper", {checkMode:isDraggingNow})}>
        <div className={cn("dropZone", {display:isDisplay})} onDragOver={handleOnDragOver}
             onDragEnter={handleOnDragEnter} onDragLeave={handleOnDragLeave} onDrop={handleOnDrop}
        />
    </div>
}