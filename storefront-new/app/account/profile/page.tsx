"use client";

import { useEffect, useState } from "react";
import { medusaStoreApi } from "@/lib/medusa-client";
import type { Address } from "@/lib/medusa-client";

export default function ProfilePage() {
  const [customer, setCustomer] = useState<any>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [addressForm, setAddressForm] = useState<Partial<Address>>({});
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [addressMessage, setAddressMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [profileRes, addressRes] = await Promise.all([
          medusaStoreApi.getCustomerProfile(),
          medusaStoreApi.getCustomerAddresses(),
        ]);
        setCustomer(profileRes.customer);
        setFirstName(profileRes.customer.first_name || "");
        setLastName(profileRes.customer.last_name || "");
        setEmail(profileRes.customer.email || "");
        setAddresses(addressRes.addresses || []);
      } catch (err: any) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      await medusaStoreApi.updateCustomerProfile({
        first_name: firstName,
        last_name: lastName,
        email,
      });
      setMessage("Profile updated successfully.");
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    }
  }

  async function handleAddressSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAddressError(null);
    setAddressMessage(null);
    try {
      if (editingAddressId) {
        await medusaStoreApi.updateCustomerAddress(editingAddressId, addressForm);
        setAddressMessage("Address updated successfully.");
      } else {
        await medusaStoreApi.addCustomerAddress(addressForm as Address);
        setAddressMessage("Address added successfully.");
      }
      const { addresses } = await medusaStoreApi.getCustomerAddresses();
      setAddresses(addresses);
      setAddressForm({});
      setEditingAddressId(null);
    } catch (err: any) {
      setAddressError(err.message || "Failed to save address");
    }
  }

  async function handleDeleteAddress(id: string) {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      await medusaStoreApi.deleteCustomerAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete address");
    }
  }

  async function handleSetDefault(id: string) {
    try {
      await medusaStoreApi.setDefaultCustomerAddress(id);
      const { addresses } = await medusaStoreApi.getCustomerAddresses();
      setAddresses(addresses);
    } catch (err: any) {
      alert(err.message || "Failed to set default address");
    }
  }

  function startAddAddress() {
    setEditingAddressId(null);
    setAddressForm({});
    setAddressError(null);
    setAddressMessage(null);
  }

  function startEditAddress(address: Address) {
    setEditingAddressId(address.id!);
    setAddressForm(address);
    setAddressError(null);
    setAddressMessage(null);
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">My Profile</h1>
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-600">{message}</p>}
      <form onSubmit={handleProfileUpdate} className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="w-full bg-primary text-white p-2 rounded">
          Update Profile
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">My Addresses</h2>
      {addresses.length === 0 && <p>No saved addresses.</p>}
      <div className="space-y-4 mb-6">
        {addresses.map((addr) => (
          <div key={addr.id} className="border p-4 rounded relative">
            <p>{addr.first_name} {addr.last_name}</p>
            <p>{addr.address_1}{addr.address_2 ? `, ${addr.address_2}` : ""}</p>
            <p>{addr.city}, {addr.province} {addr.postal_code}</p>
            <p>{addr.country_code}</p>
            <p>{addr.phone}</p>
            {addr.is_default && <span className="text-green-600 font-semibold">Default</span>}
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => startEditAddress(addr)}
                className="px-2 py-1 border rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteAddress(addr.id!)}
                className="px-2 py-1 border rounded text-red-600"
              >
                Delete
              </button>
              {!addr.is_default && (
                <button
                  onClick={() => handleSetDefault(addr.id!)}
                  className="px-2 py-1 border rounded text-blue-600"
                >
                  Set Default
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-semibold mb-2">{editingAddressId ? "Edit Address" : "Add New Address"}</h3>
      {addressError && <p className="text-red-500">{addressError}</p>}
      {addressMessage && <p className="text-green-600">{addressMessage}</p>}
      <form onSubmit={handleAddressSubmit} className="space-y-2 mb-8">
        <input
          type="text"
          placeholder="First Name"
          value={addressForm.first_name || ""}
          onChange={(e) => setAddressForm({ ...addressForm, first_name: e.target.value })}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={addressForm.last_name || ""}
          onChange={(e) => setAddressForm({ ...addressForm, last_name: e.target.value })}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Company"
          value={addressForm.company || ""}
          onChange={(e) => setAddressForm({ ...addressForm, company: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Address Line 1"
          value={addressForm.address_1 || ""}
          onChange={(e) => setAddressForm({ ...addressForm, address_1: e.target.value })}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Address Line 2"
          value={addressForm.address_2 || ""}
          onChange={(e) => setAddressForm({ ...addressForm, address_2: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="City"
          value={addressForm.city || ""}
          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Province/State"
          value={addressForm.province || ""}
          onChange={(e) => setAddressForm({ ...addressForm, province: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Postal Code"
          value={addressForm.postal_code || ""}
          onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Country Code"
          value={addressForm.country_code || ""}
          onChange={(e) => setAddressForm({ ...addressForm, country_code: e.target.value })}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Phone"
          value={addressForm.phone || ""}
          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="w-full bg-primary text-white p-2 rounded">
          {editingAddressId ? "Update Address" : "Add Address"}
        </button>
        {editingAddressId && (
          <button
            type="button"
            onClick={startAddAddress}
            className="w-full border p-2 rounded mt-2"
          >
            Cancel Edit
          </button>
        )}
      </form>
    </div>
  );
}