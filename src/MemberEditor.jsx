import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const tierOrder = ['founding', 'chairmans_circle', 'executive', 'premier', 'industry'];

const tierLabels = {
  founding: 'Founding Members',
  chairmans_circle: "Chairman's Circle",
  executive: 'Executive Members',
  premier: 'Premier Members',
  industry: 'Industry Members',
};

const styles = {
  editor: {
    padding: '24px 40px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#888',
  },
  actions: {
    display: 'flex',
    gap: '12px',
  },
  button: {
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '500',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  saveButton: {
    backgroundColor: '#22c55e',
    color: '#fff',
  },
  cancelButton: {
    backgroundColor: '#333',
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    color: '#fff',
  },
  tierSection: {
    marginBottom: '24px',
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid #333',
  },
  tierHeader: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tierCount: {
    fontSize: '12px',
    color: '#888',
    fontWeight: '400',
  },
  dropZone: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    minHeight: '80px',
    padding: '12px',
    backgroundColor: '#0d0d0d',
    borderRadius: '6px',
    border: '2px dashed #333',
  },
  dropZoneActive: {
    borderColor: '#f7931a',
    backgroundColor: '#1a1508',
  },
  memberCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: '#2a2a2a',
    borderRadius: '6px',
    cursor: 'grab',
    border: '1px solid #444',
    transition: 'all 0.2s ease',
  },
  memberCardDragging: {
    opacity: 0.5,
    border: '1px solid #f7931a',
  },
  memberLogo: {
    width: '60px',
    height: '30px',
    objectFit: 'contain',
  },
  memberName: {
    fontSize: '12px',
    color: '#fff',
    maxWidth: '100px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  deleteButton: {
    padding: '4px 8px',
    fontSize: '12px',
    backgroundColor: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: 'auto',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    padding: '24px',
    width: '400px',
    border: '1px solid #333',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    color: '#888',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    backgroundColor: '#0d0d0d',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#fff',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    backgroundColor: '#0d0d0d',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#fff',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px',
  },
  instructions: {
    fontSize: '13px',
    color: '#888',
    marginBottom: '16px',
    padding: '12px',
    backgroundColor: '#0d0d0d',
    borderRadius: '6px',
    border: '1px solid #333',
  },
};

function SortableMember({ member, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: member.name });

  const style = {
    ...styles.memberCard,
    ...(isDragging ? styles.memberCardDragging : {}),
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <img
        src={member.logo_url}
        alt={member.name}
        style={styles.memberLogo}
        onError={(e) => { e.target.style.display = 'none'; }}
      />
      <span style={styles.memberName}>{member.name}</span>
      <button
        style={styles.deleteButton}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(member.name);
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        X
      </button>
    </div>
  );
}

function DroppableTier({ tier, members, onDelete, isOver }) {
  return (
    <div style={styles.tierSection}>
      <div style={styles.tierHeader}>
        {tierLabels[tier]}
        <span style={styles.tierCount}>{members.length} members</span>
      </div>
      <SortableContext items={members.map(m => m.name)} strategy={horizontalListSortingStrategy}>
        <div style={{
          ...styles.dropZone,
          ...(isOver ? styles.dropZoneActive : {}),
        }}>
          {members.length === 0 ? (
            <span style={{ color: '#555', fontSize: '13px' }}>Drop members here</span>
          ) : (
            members.map(member => (
              <SortableMember
                key={member.name}
                member={member}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export function MemberEditor({ members: initialMembers, onSave, onCancel }) {
  const [members, setMembers] = useState(initialMembers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [activeTier, setActiveTier] = useState(null);
  const [newMember, setNewMember] = useState({ name: '', tier: 'executive', logo_url: '' });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getMembersByTier = (tier) => members.filter(m => m.tier === tier);

  const findMemberTier = (name) => {
    const member = members.find(m => m.name === name);
    return member?.tier;
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    setActiveTier(findMemberTier(event.active.id));
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeItem = members.find(m => m.name === active.id);
    const overItem = members.find(m => m.name === over.id);

    if (!activeItem) return;

    // If dropping on another member, get their tier
    if (overItem && activeItem.tier !== overItem.tier) {
      setMembers(prev => prev.map(m =>
        m.name === active.id ? { ...m, tier: overItem.tier } : m
      ));
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveTier(null);

    if (!over) return;

    const activeItem = members.find(m => m.name === active.id);
    const overItem = members.find(m => m.name === over.id);

    if (activeItem && overItem && active.id !== over.id) {
      const sameTier = activeItem.tier === overItem.tier;
      if (sameTier) {
        const tierMembers = getMembersByTier(activeItem.tier);
        const oldIndex = tierMembers.findIndex(m => m.name === active.id);
        const newIndex = tierMembers.findIndex(m => m.name === over.id);

        const reordered = arrayMove(tierMembers, oldIndex, newIndex);
        setMembers(prev => [
          ...prev.filter(m => m.tier !== activeItem.tier),
          ...reordered,
        ]);
      }
    }
  };

  const handleDelete = (name) => {
    if (confirm(`Remove ${name} from the grid?`)) {
      setMembers(prev => prev.filter(m => m.name !== name));
    }
  };

  const handleAddMember = () => {
    if (!newMember.name || !newMember.logo_url) {
      alert('Please fill in name and logo URL');
      return;
    }

    setMembers(prev => [...prev, {
      name: newMember.name,
      logo_url: newMember.logo_url,
      tier: newMember.tier,
      is_founding: newMember.tier === 'founding',
    }]);

    setNewMember({ name: '', tier: 'executive', logo_url: '' });
    setShowAddModal(false);
  };

  const handleSave = () => {
    // Reorder to ensure tier order is maintained
    const ordered = [];
    tierOrder.forEach(tier => {
      ordered.push(...members.filter(m => m.tier === tier));
    });
    onSave(ordered);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For now, just use the filename - user will need to add the file manually
      const filename = file.name.replace(/\s+/g, '-').toLowerCase();
      setNewMember(prev => ({ ...prev, logo_url: `logos/${filename}` }));
    }
  };

  const activeMember = activeId ? members.find(m => m.name === activeId) : null;

  return (
    <div style={styles.editor}>
      <div style={styles.header}>
        <span style={styles.title}>Edit Members</span>
        <div style={styles.actions}>
          <button
            style={{ ...styles.button, ...styles.addButton }}
            onClick={() => setShowAddModal(true)}
          >
            + Add Member
          </button>
          <button
            style={{ ...styles.button, ...styles.cancelButton }}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            style={{ ...styles.button, ...styles.saveButton }}
            onClick={handleSave}
          >
            Save & Download JSON
          </button>
        </div>
      </div>

      <div style={styles.instructions}>
        Drag members between tiers to reorganize. Click X to remove a member.
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {tierOrder.map(tier => (
          <DroppableTier
            key={tier}
            tier={tier}
            members={getMembersByTier(tier)}
            onDelete={handleDelete}
            isOver={activeTier && activeTier !== tier}
          />
        ))}

        <DragOverlay>
          {activeMember ? (
            <div style={{ ...styles.memberCard, cursor: 'grabbing' }}>
              <img
                src={activeMember.logo_url}
                alt={activeMember.name}
                style={styles.memberLogo}
              />
              <span style={styles.memberName}>{activeMember.name}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {showAddModal && (
        <div style={styles.overlay} onClick={() => setShowAddModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalTitle}>Add New Member</div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Company Name</label>
              <input
                type="text"
                style={styles.input}
                value={newMember.name}
                onChange={e => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Company Name"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Tier</label>
              <select
                style={styles.select}
                value={newMember.tier}
                onChange={e => setNewMember(prev => ({ ...prev, tier: e.target.value }))}
              >
                {tierOrder.map(tier => (
                  <option key={tier} value={tier}>{tierLabels[tier]}</option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Logo File</label>
              <input
                type="file"
                accept="image/*"
                style={styles.input}
                onChange={handleFileUpload}
              />
              <input
                type="text"
                style={{ ...styles.input, marginTop: '8px' }}
                value={newMember.logo_url}
                onChange={e => setNewMember(prev => ({ ...prev, logo_url: e.target.value }))}
                placeholder="logos/filename.png"
              />
            </div>

            <div style={styles.modalActions}>
              <button
                style={{ ...styles.button, ...styles.cancelButton }}
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                style={{ ...styles.button, ...styles.saveButton }}
                onClick={handleAddMember}
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MemberEditor;
