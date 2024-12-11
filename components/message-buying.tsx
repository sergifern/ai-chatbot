'use client'

import { useEffect, useState } from 'react'
import { Check, CreditCard, FileText, Link, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Step {
  id: number
  title: string
  icon: React.ReactNode
  status: 'pending' | 'processing' | 'completed'
}

export default function PurchaseProgress() {
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      title: 'Waiting for approval',
      icon: <Link className="h-4 w-4" />,
      status: 'processing'
    },
    {
      id: 2,
      title: 'Processing payment',
      icon: <CreditCard className="h-4 w-4" />,
      status: 'pending'
    },
    {
      id: 3,
      title: 'Generating receipt',
      icon: <FileText className="h-4 w-4" />,
      status: 'pending'
    }
  ])

  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (currentStep > 0 && currentStep < steps.length) {
      const timer = setTimeout(() => {
        setSteps(prev =>
          prev.map((step, idx) => ({
            ...step,
            status: idx === currentStep ? 'processing' : step.status
          }))
        )

        const completionTimer = setTimeout(() => {
          setSteps(prev =>
            prev.map((step, idx) => ({
              ...step,
              status: idx === currentStep ? 'completed' : step.status
            }))
          )
          setCurrentStep(prev => prev + 1)
        }, 3500)

        return () => clearTimeout(completionTimer)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [currentStep, steps.length])

  const handleApprove = () => {
    setSteps(prev =>
      prev.map((step, idx) => ({
        ...step,
        status: idx === 0 ? 'completed' : step.status
      }))
    )
    setCurrentStep(1)
  }

  return (
    <Card className="w-full max-w-sm bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardContent className="p-6">
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center space-x-4 transition-opacity duration-200 ${
                step.status === 'pending' ? 'opacity-50' : 'opacity-100'
              }`}
            >
              <div className="flex-shrink-0">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    step.status === 'completed'
                      ? 'bg-green-500'
                      : step.status === 'processing'
                      ? 'bg-primary'
                      : 'bg-secondary'
                  }`}
                >
                  {step.status === 'completed' ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : step.status === 'processing' ? (
                    <Loader2 className="h-4 w-4 text-white animate-spin" />
                  ) : (
                    <div className="text-secondary-foreground">{step.icon}</div>
                  )}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-foreground">{step.title}</div>
                <div className="text-sm text-muted-foreground">
                  {step.status === 'completed'
                    ? 'Completed'
                    : step.status === 'processing'
                    ? 'In progress...'
                    : 'Waiting...'}
                </div>
              </div>
              {index === 0 && step.status === 'processing' && (
                <Button
                  size="sm"
                  onClick={handleApprove}
                  className="ml-auto"
                >
                  Approve
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

