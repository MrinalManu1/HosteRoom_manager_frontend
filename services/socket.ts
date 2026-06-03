import { io, Socket } from 'socket.io-client'
import { store } from '@/store/store'
import { memberCameOnline, memberWentOffline, memberJoined, memberLeft, setOnlineMembers } from '@/features/householdSlice'
import { addItem, updateItem, removeItem } from '@/features/inventorySlice'
import { addActivity, addNotification } from '@/features/notificationSlice'
import type { Member } from '@/features/householdSlice'
import type { InventoryItem } from '@/features/inventorySlice'
import type { Activity, Notification } from '@/features/notificationSlice'

// Socket.IO connection manager
class SocketService {
  private socket: Socket | null = null
  private serverUrl: string = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'

  // Connect to socket server after login
  connect(token: string, householdId: string) {
    if (this.socket?.connected) return

    this.socket = io(this.serverUrl, {
      auth: { token },
      query: { householdId },
      transports: ['websocket', 'polling'],
    })

    this.setupListeners()
  }

  // Disconnect from socket server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  // Setup all socket event listeners
  private setupListeners() {
    if (!this.socket) return

    // Connection events
    this.socket.on('connect', () => {
      console.log('[ShelfLife] Connected to realtime server')
    })

    this.socket.on('disconnect', () => {
      console.log('[ShelfLife] Disconnected from realtime server')
    })

    // Online status events
    this.socket.on('online_members', (memberIds: string[]) => {
      store.dispatch(setOnlineMembers(memberIds))
    })

    this.socket.on('user_online', (memberId: string) => {
      store.dispatch(memberCameOnline(memberId))
    })

    this.socket.on('user_offline', (memberId: string) => {
      store.dispatch(memberWentOffline(memberId))
    })

    // Household membership events
    this.socket.on('member_joined', (data: { member: Member; activity: Activity }) => {
      store.dispatch(memberJoined(data.member))
      store.dispatch(addActivity(data.activity))
    })

    this.socket.on('member_left', (data: { memberId: string; activity: Activity }) => {
      store.dispatch(memberLeft(data.memberId))
      store.dispatch(addActivity(data.activity))
    })

    // Inventory events
    this.socket.on('item_added', (data: { item: InventoryItem; activity: Activity }) => {
      store.dispatch(addItem(data.item))
      store.dispatch(addActivity(data.activity))
    })

    this.socket.on('item_updated', (data: { item: InventoryItem; activity: Activity }) => {
      store.dispatch(updateItem(data.item))
      store.dispatch(addActivity(data.activity))
    })

    this.socket.on('item_used', (data: { itemId: string; activity: Activity }) => {
      store.dispatch(removeItem(data.itemId))
      store.dispatch(addActivity(data.activity))
    })

    this.socket.on('item_wasted', (data: { itemId: string; activity: Activity }) => {
      store.dispatch(removeItem(data.itemId))
      store.dispatch(addActivity(data.activity))
    })

    // Notification events
    this.socket.on('expiry_alert', (notification: Notification) => {
      store.dispatch(addNotification(notification))
    })

    this.socket.on('achievement', (notification: Notification) => {
      store.dispatch(addNotification(notification))
    })
  }

  // Emit events to server
  emitItemAdded(item: InventoryItem) {
    this.socket?.emit('add_item', item)
  }

  emitItemUsed(itemId: string) {
    this.socket?.emit('mark_used', itemId)
  }

  emitItemWasted(itemId: string) {
    this.socket?.emit('mark_wasted', itemId)
  }

  emitItemUpdated(item: InventoryItem) {
    this.socket?.emit('update_item', item)
  }

  emitItemDeleted(itemId: string) {
    this.socket?.emit('delete_item', itemId)
  }
}

// Export singleton instance
export const socketService = new SocketService()
