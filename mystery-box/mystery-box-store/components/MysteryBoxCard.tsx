'use client'

import { useState, CSSProperties } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface MysteryBoxCardProps {
  id: string;
  budget: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  estimatedValue?: number;
  thumbnailUrl?: string;
}

export default function MysteryBoxCard({
  id,
  budget,
  status,
  createdAt,
  estimatedValue,
  thumbnailUrl = '/mystery-box-placeholder.jpg'
}: MysteryBoxCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  const getStatusColor = (status: string): { bg: string; text: string } => {
    switch (status) {
      case 'pending':
        return { bg: '#fef9c3', text: '#854d0e' }
      case 'processing':
        return { bg: '#dbeafe', text: '#1e40af' }
      case 'shipped':
        return { bg: '#f3e8ff', text: '#6b21a8' }
      case 'delivered':
        return { bg: '#dcfce7', text: '#166534' }
      default:
        return { bg: '#f3f4f6', text: '#374151' }
    }
  }

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const statusColors = getStatusColor(status)

  // Styles
  const cardStyle: CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    border: '1px solid #f0e6ff',
    transition: 'box-shadow 0.3s ease',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  }

  const imageContainerStyle: CSSProperties = {
    position: 'relative',
    height: '12rem',
    backgroundColor: '#f5f3ff'
  }

  const budgetCircleStyle: CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '6rem',
    height: '6rem',
    backgroundColor: '#e9d5ff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const budgetTextStyle: CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#9370DB'
  }

  const thumbnailContainerStyle: CSSProperties = {
    position: 'absolute',
    bottom: '1rem',
    right: '1rem',
    width: '4rem',
    height: '4rem',
    overflow: 'hidden',
    borderRadius: '0.25rem'
  }

  const contentStyle: CSSProperties = {
    padding: '1rem',
    flex: '1'
  }

  const headerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem'
  }

  const titleStyle: CSSProperties = {
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '0.25rem'
  }

  const dateStyle: CSSProperties = {
    fontSize: '0.875rem',
    color: '#6b7280'
  }

  const statusBadgeStyle: CSSProperties = {
    padding: '0.25rem 0.5rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '500',
    backgroundColor: statusColors.bg,
    color: statusColors.text
  }

  const detailsStyle: CSSProperties = {
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid #f3f4f6'
  }

  const detailRowStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.875rem',
    marginBottom: '0.25rem'
  }

  const detailLabelStyle: CSSProperties = {
    color: '#6b7280'
  }

  const detailValueStyle: CSSProperties = {
    fontWeight: '500'
  }

  const estimatedValueStyle: CSSProperties = {
    fontWeight: '500',
    color: '#059669'
  }

  const buttonStyle: CSSProperties = {
    display: 'block',
    width: '100%',
    marginTop: '1rem',
    backgroundColor: '#9370DB',
    color: 'white',
    textAlign: 'center',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    transition: 'background-color 0.3s ease'
  }

  return (
    <div style={cardStyle}>
      <div style={imageContainerStyle}>
        <div style={budgetCircleStyle}>
          <span style={budgetTextStyle}>€{budget}</span>
        </div>
        {thumbnailUrl && (
          <div style={thumbnailContainerStyle}>
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <Image 
                src={thumbnailUrl}
                alt="Mystery Box"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        )}
      </div>
      
      <div style={contentStyle}>
        <div style={headerStyle}>
          <div>
            <h3 style={titleStyle}>Mystery Box #{id.slice(-6)}</h3>
            <p style={dateStyle}>{formatDate(createdAt)}</p>
          </div>
          <span style={statusBadgeStyle}>
            {getStatusText(status)}
          </span>
        </div>
        
        <div style={detailsStyle}>
          <div style={detailRowStyle}>
            <span style={detailLabelStyle}>Budget:</span>
            <span style={detailValueStyle}>€{budget.toFixed(2)}</span>
          </div>
          
          {estimatedValue && (
            <div style={detailRowStyle}>
              <span style={detailLabelStyle}>Estimated Value:</span>
              <span style={estimatedValueStyle}>€{estimatedValue.toFixed(2)}</span>
            </div>
          )}
        </div>
        
        <Link 
          href={`/orders/${id}`}
          style={buttonStyle}
        >
          View Details
        </Link>
      </div>
    </div>
  )
}