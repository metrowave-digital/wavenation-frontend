'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Box, Tag, Layers } from 'lucide-react'
import styles from './HeroMarketplace.module.css'

export interface HeroMarketplaceProps {
  productName: string
  collectionName?: string
  description?: string
  imageUrl: string
  dropDate?: string
  editionStatus?: string
  ctaHref?: string
  ctaText?: string
}

export function HeroMarketplace({
  productName,
  collectionName = 'WN_GEAR_DROP',
  description,
  imageUrl,
  dropDate = 'ACTIVE_INVENTORY',
  editionStatus = 'STANDARD_RELEASE',
  ctaHref = '/shop/all',
  ctaText = 'SHOP COLLECTION'
}: HeroMarketplaceProps) {
  return (
    <section className={styles.root}>
      {/* Product Isolated Focus */}
      <div className={styles.bgGlow} aria-hidden="true" />
      
      <div className={styles.container}>
        {/* Left: Product Visual */}
        <div className={styles.visualColumn}>
          <div className={styles.imageFrame}>
            <Image 
              src={imageUrl} 
              alt={productName} 
              fill 
              className={styles.productImage} 
              priority 
            />
            <div className={styles.gridOverlay} />
          </div>
        </div>

        {/* Right: Drop Manifest */}
        <div className={styles.dataColumn}>
          <div className={styles.sysBreadcrumb}>
            <ShoppingBag size={12} className={styles.sysIcon} />
            <span>WN.MARKETPLACE {'//'} SOURCE // MERCH_SYSTEM</span>
          </div>

          <header className={styles.header}>
            <span className={styles.collectionTitle}>{collectionName.toUpperCase()}</span>
            <h1 className={styles.productName}>{productName}</h1>
          </header>
          
          {description && (
            <p className={styles.description}>{description}</p>
          )}

          {/* Product Specs Manifest */}
          <div className={styles.manifestGrid}>
            <div className={styles.specBox}>
              <span className={styles.sLabel}><Box size={12} /> DROP_STATUS</span>
              <span className={styles.sValue} style={{ color: '#00FFFF' }}>{dropDate.toUpperCase()}</span>
            </div>
            <div className={styles.specBox}>
              <span className={styles.sLabel}><Layers size={12} /> EDITION_TYPE</span>
              <span className={styles.sValue}>{editionStatus.toUpperCase()}</span>
            </div>
            <div className={styles.specBox}>
              <span className={styles.sLabel}><Tag size={12} /> FULFILLMENT</span>
              <span className={styles.sValue}>GLOBAL_SIGNAL</span>
            </div>
          </div>

          <div className={styles.actions}>
            <Link href={ctaHref} className={styles.primaryBtn}>
              <ShoppingBag size={18} fill="#000" color="#000" />
              <span>{ctaText.toUpperCase()}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}