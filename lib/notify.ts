import emailjs from '@emailjs/browser'

const EMAILJS_SERVICE_ID = 'service_f4aubtw'
const EMAILJS_TEMPLATE_ID = 'template_rlva22r'
const EMAILJS_PUBLIC_KEY = 'z5BQA4ltpy2oYOOWI'

export function initEmailJS() {
  emailjs.init(EMAILJS_PUBLIC_KEY)
}

export async function sendItemFoundEmail(params: {
  to_name: string
  to_email: string
  item_name: string
  item_location: string
  found_by: string
}): Promise<boolean> {
  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_name: params.to_name,
      to_email: params.to_email,
      item_name: params.item_name,
      item_location: params.item_location,
      found_by: params.found_by,
      message: `O item "${params.item_name}" foi encontrado em "${params.item_location}" por ${params.found_by}. Acesse o sistema para mais detalhes.`,
    })
    return true
  } catch (err) {
    console.error('Erro ao enviar email:', err)
    return false
  }
}
