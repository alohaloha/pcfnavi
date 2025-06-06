import {SVGProps} from 'react';

export function FeBeginner(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
             viewBox="0 0 24 24" {...props}>{/* Icon from Feather Icon by Megumi Hano - https://github.com/feathericon/feathericon/blob/master/LICENSE */}
            <path
                d="M12 7.529L5 5.09v10.372l7 3.251zM5.632 3.108L12 5.326l6.368-2.218c1.047-.365 2.18.227 2.53 1.322c.067.213.102.436.102.66v10.372c0 .826-.465 1.574-1.188 1.91L12 21l-7.812-3.628C3.465 17.036 3 16.288 3 15.462V5.09C3 3.936 3.895 3 5 3c.215 0 .429.037.632.108"></path>
        </svg>
    )
}