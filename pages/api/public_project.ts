/**
 * @path /pages/api/public_project.ts
 *
 * @project videonote
 * @file public_project.ts
 *
 * @author Josh Mu <hello@joshmu.dev>
 * @created Thursday, 8th October 2020
 * @modified Sunday, 22nd November 2020 7:02:38 pm
 * @copyright © 2020 - 2020 MU
 */

import bcrypt from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import { NextApiRequest, NextApiResponse } from 'next'

import { ProjectDocInterface, ShareDocInterface } from '@/shared/types'
import { Project, Share } from '@/utils/mongoose'

// GET 1 PROJECT
export default async (req: NextApiRequest, res: NextApiResponse) => {
  // project share id
  const { shareUrl, password } = req.body

  // get project
  let projectDoc: ProjectDocInterface
  let shareDoc: ShareDocInterface
  try {
    shareDoc = await Share.findOne({ url: shareUrl })

    if (shareDoc.password.length > 0) {
      // 'shared project password required'

      if (password) {
        // compare passwords
        const match = await bcrypt.compare(password, shareDoc.password)
        console.log({ match })
        if (!match) {
          return res.status(StatusCodes.OK).json({ msg: 'password incorrect' })
        }
      } else {
        // else
        return res
          .status(StatusCodes.OK)
          .json({ msg: 'shared project password required' })
      }
    }

    projectDoc = await Project.findById(shareDoc.project)
      .populate([
        {
          path: 'notes',
          model: 'Note',
          populate: {
            path: 'user',
            model: 'User',
            select: 'username email',
          },
        },
        { path: 'share', model: 'Share' },
      ])
      .lean()
  } catch (error) {
    // no project found
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'Share url does not exist.' })
  }

  // compose output data in the same shape as the entire user object
  const data = {
    user: {
      projects: [projectDoc],
    },
  }

  // send data
  res.status(StatusCodes.OK).json(data)
}
