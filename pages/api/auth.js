import { StatusCodes } from 'http-status-codes'

import { extractUser } from '@/utils/apiHelpers'
import { authenticateToken } from '@/utils/jwt'
import { Project, User } from '@/utils/mongoose'

export default async (req, res) => {
  // Gather the jwt access token from the request header
  let token = req.headers['authorization']
  // strip 'bearer'
  if (token) token = token.replace(/bearer /i, '')

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: 'No token. Authorization denied.' })
  }

  let email
  try {
    email = await authenticateToken(token)
  } catch (err) {
    console.error(err.message)
    return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Invalid token' })
  }

  // get user via email
  const user = await User.findOne({ email }).lean()

  if (user === null)
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'No user found.' })

  // get projects
  let projects = []
  if (user.projectIds.length > 0) {
    projects = await Project.find({ _id: user.projectIds }).lean()
  }

  res.status(StatusCodes.OK).json({
    user: extractUser(user),
    projects: projects,
  })
}
