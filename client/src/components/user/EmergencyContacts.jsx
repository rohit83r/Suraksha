import { useState } from "react";
import {
  updateEmergencyContact,
  deleteEmergencyContact,
} from "../../api/touristApi";


export default function EmergencyContacts({ contactsData }) {
//   console.log(contactsData);
  const [contacts, setContacts]=useState(contactsData)
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  const startEdit = (contact) => {
    setEditingId(contact.id);
    setFormData({
      name: contact.name,
      phone: contact.phone,
      relation: contact.relation,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const saveUpdate = async (id) => {
  try {
    // const updated = await updateEmergencyContact(id, formData);
    // console.log(id," ",formData);

    setContacts((prev) =>
      prev.map((c) => (c.id === id ? updated : c))
    );

    setEditingId(null);
  } catch (err) {
    console.error("Update contact failed", err);
  }
};


  const deleteContact = async (id) => {
  if (!confirm("Delete this emergency contact?")) return;

  try {
    // await deleteEmergencyContact(id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
    console.log(contacts.filter((c) => c.id === id))
  } catch (err) {
    console.error("Delete contact failed", err);
  }
};


  return (
    <div className="bg-[#020617] border border-white/10 rounded-xl p-6">
      <h2 className="text-xl mb-4">Emergency Contacts</h2>
        {/* <div className="bg-[#020617] border border-white/10 rounded-xl p-6">
      <h2 className="text-xl mb-4">Emergency Contacts</h2>

      {list.map((c, i) => (
        <div key={i} className="grid grid-cols-4 gap-2 mb-2">
          <input value={c.name} onChange={(e) => updateContact(i, "name", e.target.value)} />
          <input value={c.phone} onChange={(e) => updateContact(i, "phone", e.target.value)} />
          <input value={c.relation} onChange={(e) => updateContact(i, "relation", e.target.value)} />
        </div>
      ))}

      <div className="flex gap-4 mt-4">
        <button
          onClick={() => setList([...list, { name: "", phone: "", relation: "" }])}
          className="btn-secondary"
        >
          Add Contact
        </button>
        <button onClick={() => onSave(list)} className="btn-primary">
          Save Contacts
        </button>
      </div>
    </div> */}
      {contacts.map((contact) => {
        const isEditing = editingId === contact.id;
        console.log(editingId," , ",contact.id);

        return (
          <div
            key={contact.id}
            className="grid grid-cols-4 gap-2 mb-2 bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3"
          >
            {/* NAME */}
            <input
              name="name"
              value={isEditing ? formData.name : contact.name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 rounded-md text-sm
                ${isEditing
                  ? "bg-slate-100 text-black border border-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  : "bg-slate-800 text-slate-300 border border-slate-700"
                }`}
            />

            {/* PHONE */}
            <input
              name="phone"
              value={isEditing ? formData.phone : contact.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 rounded-md text-sm
                ${isEditing
                  ? "bg-slate-100 text-black border border-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  : "bg-slate-800 text-slate-300 border border-slate-700"
                }`}
            />

            {/* RELATION */}
            <input
              name="relation"
              value={isEditing ? formData.relation : contact.relation}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 rounded-md text-sm
                ${isEditing
                  ? "bg-slate-100 text-black border border-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  : "bg-slate-800 text-slate-300 border border-slate-700"
                }`}
            />

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-3 pt-2">
              {isEditing ? (
                <>
                  <button
                    onClick={() => saveUpdate(contact.id)}
                    className="px-4 py-1.5 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm"
                  >
                    Save
                  </button>

                  <button
                    onClick={cancelEdit}
                    className="px-4 py-1.5 rounded-md bg-slate-600 hover:bg-slate-700 text-white text-sm"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(contact)}
                    className="px-4 py-1.5 rounded-md bg-cyan-600 hover:bg-cyan-700 text-white text-sm"
                  >
                    Update
                  </button>

                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="px-4 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => setContacts([...contacts, { name: "", phone: "", relation: "" }])}
          className="bg-cyan-400 hover:bg-blue-700 cursor-pointer px-4 py-2 rounded-md"
        >
          Add Contact
        </button>
      </div>
    </div>
  );
}
