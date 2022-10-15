import { get } from "../db/api.js"

export default async (req, resp, next) => {
    const params = req.body
    const tokenId = params.tokenId
    const sessionList = await get("session")
    for (const session of sessionList) {
        if (session.tokenId === tokenId) {
            const diff = Date.now() - session.actionTime
            const vaild_duration = 14 * 24 * 60 * 60 * 1000
            if (diff <= vaild_duration) {
                req.body.userId = session.userId
                next()
                return
            }
        }
    }
    resp.send({
        code: "3",
        data: "登录已过期,请重新登录"

    })
}