import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

export const config = {
    matcher: ['/((?!api|_next|favicon\\.ico).*)'], // ← ✅ これで /api を明示的に除外
}

export function middleware(request: NextRequest) {
    // 環境変数が設定されている場合のみ認証を要求
    const isAuthEnabled = process.env.BASIC_AUTH_USER && process.env.BASIC_AUTH_PASSWORD

    // 認証が無効化されている場合はすぐに次へ進む
    if (!isAuthEnabled) {
        return NextResponse.next()
    }

    const basicAuth = request.headers.get('authorization')

    if (basicAuth) {
        const authValue = basicAuth.split(' ')[1]
        try {
            const [user, pwd] = atob(authValue).split(':')

            if (
                user === process.env.BASIC_AUTH_USER &&
                pwd === process.env.BASIC_AUTH_PASSWORD
            ) {
                return NextResponse.next()
            }
        } catch (error) {
            // デコードエラーを処理
            console.error('認証エラー:', error)
        }
    }

    // 認証情報が正しくない場合
    return new NextResponse('認証が必要です', {
        status: 401,
        headers: {
            'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
    })
} 