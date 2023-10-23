import crypto from 'crypto'

console.log('env', process.env.IVConfig)

export const decryptChannelKey = (
  encryptedChannelKey: string,
  encryptedUserKey: string
): string => {
  const iv = Buffer.from(process.env.IVConfig! || '65a2b862088509b122407245706fb715', 'hex')
  const userKey = Buffer.from(encryptedUserKey, 'hex')

  const decipher = crypto.createDecipheriv('aes256', userKey, iv)
  const decryptedChannelKey =
    decipher.update(encryptedChannelKey, 'hex', 'hex') + decipher.final('hex')

  return decryptedChannelKey
}

export const encryptMessage = (
  decryptedChannelKey: string,
  message: string
): string => {
  const messageCiper = crypto.createCipheriv(
    'aes256',
    Buffer.from(decryptedChannelKey, 'hex'),
    Buffer.from(process.env.IVConfig! || '65a2b862088509b122407245706fb715', 'hex')
  )
  const encryptedMessage =
    messageCiper.update(message, 'utf-8', 'hex') + messageCiper.final('hex')

  return encryptedMessage
}

export const decryptMessage = (
  decryptedChannelKey: string,
  encryptedMessage: string
): string => {
  const messageDecipher = crypto.createDecipheriv(
    'aes256',
    Buffer.from(Buffer.from(decryptedChannelKey, 'hex')),
    Buffer.from(process.env.IVConfig! || '65a2b862088509b122407245706fb715', 'hex')
  )
  const decryptedMessage =
    messageDecipher.update(encryptedMessage, 'hex', 'utf-8') +
    messageDecipher.final('utf-8')

  return decryptedMessage
}
