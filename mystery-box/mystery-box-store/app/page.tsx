'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ 
      background: 'linear-gradient(to bottom, #f5f3ff, #ffffff)',
      padding: '2rem 1rem'
    }}>
      {/* Hero Section */}
      <section style={{ padding: '2rem 0' }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#9370DB',
            marginBottom: '1rem'
          }}>
            Mystery Box Store
          </h1>
          <p style={{ 
            fontSize: '1.25rem',
            maxWidth: '800px',
            marginBottom: '2rem'
          }}>
            Set your budget, and we'll curate a surprise selection of premium products worth more than what you pay.
          </p>
          <div style={{ 
            display: 'flex',
            gap: '1rem',
            marginBottom: '3rem'
          }}>
            <Link href="/create-box" style={{ 
              backgroundColor: '#9370DB',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.25rem',
              fontWeight: 'bold',
              textDecoration: 'none'
            }}>
              Create Your Box
            </Link>
            <Link href="/how-it-works" style={{ 
              backgroundColor: 'white',
              color: '#9370DB',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.25rem',
              fontWeight: 'bold',
              border: '1px solid #9370DB',
              textDecoration: 'none'
            }}>
              How It Works
            </Link>
          </div>
          
          <div style={{ 
            position: 'relative',
            width: '300px',
            height: '300px',
            margin: '0 auto'
          }}>
            <div style={{ 
              position: 'absolute',
              inset: 0,
              backgroundColor: '#E6E6FA',
              borderRadius: '0.5rem',
              transform: 'rotate(6deg)'
            }}></div>
            <div style={{ 
              position: 'absolute',
              inset: 0,
              backgroundColor: '#FFD700',
              borderRadius: '0.5rem',
              transform: 'rotate(-3deg)'
            }}></div>
            <div style={{ 
              position: 'absolute',
              inset: 0,
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ 
                  width: '6rem',
                  height: '6rem',
                  backgroundColor: '#f5f3ff',
                  borderRadius: '50%',
                  margin: '0 auto 1rem auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem'
                }}>
                  🎁
                </div>
                <h3 style={{ 
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#9370DB',
                  marginBottom: '0.5rem'
                }}>
                  Mystery Box
                </h3>
                <p style={{ 
                  color: '#666',
                  marginBottom: '1rem'
                }}>
                  Surprise products curated just for you
                </p>
                <div style={{ 
                  color: '#D4AF37',
                  fontWeight: 'bold'
                }}>
                  Starting at €25
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ 
        padding: '4rem 0',
        backgroundColor: 'white'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto'
        }}>
          <h2 style={{ 
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#9370DB',
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            How It Works
          </h2>
          
          <div style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '2rem'
          }}>
            <div style={{ 
              textAlign: 'center',
              maxWidth: '300px'
            }}>
              <div style={{ 
                width: '4rem',
                height: '4rem',
                backgroundColor: '#f5f3ff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#9370DB'
              }}>
                1
              </div>
              <h3 style={{ 
                fontSize: '1.25rem',
                fontWeight: 'bold',
                marginBottom: '0.75rem'
              }}>
                Choose Your Budget
              </h3>
              <p style={{ color: '#666' }}>
                Select how much you want to spend on your mystery box.
              </p>
            </div>
            
            <div style={{ 
              textAlign: 'center',
              maxWidth: '300px'
            }}>
              <div style={{ 
                width: '4rem',
                height: '4rem',
                backgroundColor: '#f5f3ff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#9370DB'
              }}>
                2
              </div>
              <h3 style={{ 
                fontSize: '1.25rem',
                fontWeight: 'bold',
                marginBottom: '0.75rem'
              }}>
                We Curate Products
              </h3>
              <p style={{ color: '#666' }}>
                Our team selects premium items worth more than your budget.
              </p>
            </div>
            
            <div style={{ 
              textAlign: 'center',
              maxWidth: '300px'
            }}>
              <div style={{ 
                width: '4rem',
                height: '4rem',
                backgroundColor: '#f5f3ff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#9370DB'
              }}>
                3
              </div>
              <h3 style={{ 
                fontSize: '1.25rem',
                fontWeight: 'bold',
                marginBottom: '0.75rem'
              }}>
                Receive Your Surprise
              </h3>
              <p style={{ color: '#666' }}>
                Your mystery box arrives at your doorstep, ready to unbox!
              </p>
            </div>
          </div>
          
          <div style={{ 
            textAlign: 'center',
            marginTop: '3rem'
          }}>
            <Link href="/how-it-works" style={{ 
              color: '#9370DB',
              fontWeight: 'bold',
              textDecoration: 'none'
            }}>
              Learn More About Our Process →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '4rem 0',
        backgroundColor: '#9370DB',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto'
        }}>
          <h2 style={{ 
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem'
          }}>
            Ready for Your Surprise?
          </h2>
          <p style={{ 
            fontSize: '1.25rem',
            maxWidth: '600px',
            margin: '0 auto 2rem auto'
          }}>
            Create your mystery box today and experience the joy of unboxing a curated surprise.
          </p>
          <Link href="/create-box" style={{ 
            backgroundColor: 'white',
            color: '#9370DB',
            padding: '0.75rem 2rem',
            borderRadius: '0.25rem',
            fontWeight: 'bold',
            fontSize: '1.125rem',
            textDecoration: 'none',
            display: 'inline-block'
          }}>
            Create Your Box Now
          </Link>
        </div>
      </section>
    </div>
  )
}
