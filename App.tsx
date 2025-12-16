import { useEffect, useState } from 'react'
import { CapturePage } from './pages/CapturePage'
import { SalesPage } from './pages/SalesPage'
import { ThankYouPage } from './pages/ThankYouPage'
import { Step, UserLead, OrderDetails, Variant } from './types'
import { getAbVariant } from './utils/abTesting'

export default function App() {
  const [step, setStep] = useState<Step>(Step.CAPTURE)
  const [lead, setLead] = useState<UserLead | null>(null)
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [variant, setVariant] = useState<Variant>('A')

  useEffect(() => {
    setVariant(getAbVariant())
  }, [])

  return (
    <div className="antialiased text-slate-900">
      {step === Step.CAPTURE && (
        <CapturePage
          onComplete={(l) => {
            setLead(l)
            window.scrollTo(0, 0)
            setStep(Step.SALES)
          }}
        />
      )}

      {step === Step.SALES && (
        <SalesPage
          leadName={lead?.name}
          leadEmail={lead?.email}
          variant={variant}
          onOrder={(o) => {
            setOrder(o)
            window.scrollTo(0, 0)
            setStep(Step.THANK_YOU)
          }}
        />
      )}

      {step === Step.THANK_YOU && <ThankYouPage order={order} />}
    </div>
  )
}
