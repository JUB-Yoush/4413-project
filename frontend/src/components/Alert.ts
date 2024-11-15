import {tv} from 'tailwind-variants'

export const baseAlert = tv({
    base: 'text-black text-base text-center mb-1 py-3 px-5 ' +
        'bg-cream border border-camel' +
        'cursor-pointer hover:text-white hover:bg-camel hover:border-transparent' +
        'relative align-middle inline-flex items-center justify-center',
    variants: {
        size: {
            lg: 'text-base py-3 px-6',
            xs: 'text-xs py-1 px-2',
            md: 'text-sm py-2 px-4',
            xl: 'text-lg py-4 px-8',
            xxl: 'text-xl py-5 px-10',
            square_xs: 'text-xs h-4 w-4 p-1',
            square_sm: 'text-sm h-6 w-6 p-1',
            square_md: 'text-base h-8 w-8 p-1',
            square_lg: 'text-lg h-10 w-10 p-1',
            square_xl: 'text-xl h-12 w-12 p-1',
        },
        vPadding: {
            xs: 'py-[4px]',
            sm: 'py-[8px]',
            md: 'py-[12px]',
            lg: 'py-[16px]',
        },
        vSpace: {
            xs: 'my-1',
            sm: 'my-2',
            md: 'my-4',
            lg: 'my-6',
        },
        HSpace: {
            xs: 'mx-1',
            sm: 'mx-2',
            md: 'mx-4',
            lg: 'mx-6',
        },
        align: {
            center: 'mx-auto',
            right: 'ml-auto',
            left: 'mr-auto',
            top: 'mb-auto',
            bottom: 'mt-auto',
        },
        behavior: {
            block: 'w-full',
        },
    }
});

// error
export const errorAlert = tv({
    extend: baseAlert,
    base: 'bg-pink text-beige'
});

// success
export const successAlert = tv({
    extend: baseAlert,
    base: 'bg-browntea',
});