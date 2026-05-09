export type QuoteFormData = {
  name: string
  email: string
  phone: string
  service: string
  message?: string
}

export type QuoteSuccessResponse = {
  success: true
}

export type QuoteErrorResponse = {
  error: {
    code: string
    message: string
  }
}

export type QuoteApiResponse = QuoteSuccessResponse | QuoteErrorResponse
