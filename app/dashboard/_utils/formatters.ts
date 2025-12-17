export const currencyMask = (value: string) => {
    let v = value.replace(/\D/g, '') // Remove non-digits
    v = (parseInt(v) / 100).toFixed(2) + '' // Divide by 100 to get decimal
    v = v.replace('.', ',') // Replace dot with comma
    v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') // Add thousand separators
    return v === 'NaN' ? '' : v
}

export const formatBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value)
}
