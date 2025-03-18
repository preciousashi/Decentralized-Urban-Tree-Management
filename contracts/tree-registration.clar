;; Tree Registration Contract
;; Records location, species, and condition of urban trees

(define-data-var admin principal tx-sender)

;; Map of registered trees
(define-map trees
{ tree-id: (string-ascii 32) }
{
  owner: principal,
  species: (string-ascii 64),
  location: {
    latitude: int,
    longitude: int,
    address: (string-ascii 128)
  },
  height: uint,
  diameter: uint,
  condition: (string-ascii 16),
  planting-date: uint,
  last-updated: uint,
  status: (string-ascii 16)
}
)

;; Map of tree history records
(define-map tree-history
{
  tree-id: (string-ascii 32),
  record-id: uint
}
{
  update-type: (string-ascii 16),
  updated-by: principal,
  update-time: uint,
  previous-condition: (string-ascii 16),
  new-condition: (string-ascii 16),
  notes: (string-ascii 256)
}
)

;; Counter for tree history records
(define-data-var history-counter uint u0)

;; Register a new tree
(define-public (register-tree
  (tree-id (string-ascii 32))
  (species (string-ascii 64))
  (latitude int)
  (longitude int)
  (address (string-ascii 128))
  (height uint)
  (diameter uint)
  (condition (string-ascii 16))
  (planting-date uint))
(let ((current-time (default-to u0 (get-block-info? time u0))))
  (asserts! (not (is-some (map-get? trees { tree-id: tree-id }))) (err u403))

  (map-insert trees
    { tree-id: tree-id }
    {
      owner: tx-sender,
      species: species,
      location: {
        latitude: latitude,
        longitude: longitude,
        address: address
      },
      height: height,
      diameter: diameter,
      condition: condition,
      planting-date: planting-date,
      last-updated: current-time,
      status: "active"
    }
  )

  ;; Record initial history
  (let ((record-id (var-get history-counter)))
    (var-set history-counter (+ record-id u1))

    (map-insert tree-history
      {
        tree-id: tree-id,
        record-id: record-id
      }
      {
        update-type: "registration",
        updated-by: tx-sender,
        update-time: current-time,
        previous-condition: "",
        new-condition: condition,
        notes: "Initial tree registration"
      }
    )
  )

  (ok true)
)
)

;; Update tree information
(define-public (update-tree
  (tree-id (string-ascii 32))
  (height uint)
  (diameter uint)
  (condition (string-ascii 16))
  (notes (string-ascii 256)))
(let ((tree (unwrap! (map-get? trees { tree-id: tree-id }) (err u404)))
      (current-time (default-to u0 (get-block-info? time u0))))
  (asserts! (or (is-eq tx-sender (get owner tree)) (is-eq tx-sender (var-get admin))) (err u403))

  ;; Record history before updating
  (let ((record-id (var-get history-counter)))
    (var-set history-counter (+ record-id u1))

    (map-insert tree-history
      {
        tree-id: tree-id,
        record-id: record-id
      }
      {
        update-type: "update",
        updated-by: tx-sender,
        update-time: current-time,
        previous-condition: (get condition tree),
        new-condition: condition,
        notes: notes
      }
    )
  )

  ;; Update tree information
  (map-set trees
    { tree-id: tree-id }
    (merge tree {
      height: height,
      diameter: diameter,
      condition: condition,
      last-updated: current-time
    })
  )

  (ok true)
)
)

;; Update tree status (active, removed, etc.)
(define-public (update-tree-status
  (tree-id (string-ascii 32))
  (status (string-ascii 16))
  (notes (string-ascii 256)))
(let ((tree (unwrap! (map-get? trees { tree-id: tree-id }) (err u404)))
      (current-time (default-to u0 (get-block-info? time u0))))
  (asserts! (or (is-eq tx-sender (get owner tree)) (is-eq tx-sender (var-get admin))) (err u403))

  ;; Record history
  (let ((record-id (var-get history-counter)))
    (var-set history-counter (+ record-id u1))

    (map-insert tree-history
      {
        tree-id: tree-id,
        record-id: record-id
      }
      {
        update-type: "status-change",
        updated-by: tx-sender,
        update-time: current-time,
        previous-condition: (get condition tree),
        new-condition: (get condition tree),
        notes: notes
      }
    )
  )

  ;; Update tree status
  (map-set trees
    { tree-id: tree-id }
    (merge tree {
      status: status,
      last-updated: current-time
    })
  )

  (ok true)
)
)

;; Transfer tree ownership
(define-public (transfer-ownership
  (tree-id (string-ascii 32))
  (new-owner principal))
(let ((tree (unwrap! (map-get? trees { tree-id: tree-id }) (err u404))))
  (asserts! (is-eq tx-sender (get owner tree)) (err u403))

  (map-set trees
    { tree-id: tree-id }
    (merge tree { owner: new-owner })
  )

  (ok true)
)
)

;; Get tree details
(define-read-only (get-tree (tree-id (string-ascii 32)))
(map-get? trees { tree-id: tree-id })
)

;; Get tree history record
(define-read-only (get-tree-history-record (tree-id (string-ascii 32)) (record-id uint))
(map-get? tree-history { tree-id: tree-id, record-id: record-id })
)

;; Get tree history count
(define-read-only (get-tree-history-count)
(var-get history-counter)
)

;; Transfer admin rights
(define-public (transfer-admin (new-admin principal))
(begin
  (asserts! (is-eq tx-sender (var-get admin)) (err u403))
  (var-set admin new-admin)
  (ok true)
)
)

