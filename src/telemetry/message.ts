interface Message {
    type: string,
    data: {
        [key: string]: unknown 
    }
}

export { Message }