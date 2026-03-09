import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin,
  Building,
  CreditCard,
  Calendar,
  Search,
  Filter,
  Send,
  Facebook,
  Instagram,
  Globe,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useSupplierStore } from '../store/supplierStore';
import { useAuthStore } from '../store/authStore';
import { Supplier, CommunicationLog } from '../types';

const CRM: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'suppliers' | 'communications' | 'orders'>('suppliers');
  const [showSupplierForm, setShowSupplierForm] = useState(false);
  const [showCommunicationForm, setShowCommunicationForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { 
    suppliers, 
    communications, 
    orders,
    addSupplier, 
    updateSupplier, 
    deleteSupplier,
    addCommunication,
    getCommunicationsBySupplier 
  } = useSupplierStore();
  
  const { user } = useAuthStore();

  const [supplierFormData, setSupplierFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Argentina',
    category: '',
    status: 'active' as 'active' | 'inactive' | 'pending',
    whatsapp: '',
    facebook: '',
    instagram: '',
    website: '',
    paymentTerms: '',
    creditLimit: '',
    notes: ''
  });

  const [communicationFormData, setCommunicationFormData] = useState({
    supplierId: '',
    type: 'whatsapp' as 'whatsapp' | 'facebook' | 'instagram' | 'email' | 'phone' | 'meeting',
    subject: '',
    message: '',
    direction: 'outgoing' as 'incoming' | 'outgoing'
  });

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || supplier.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const supplierData = {
      name: supplierFormData.name,
      company: supplierFormData.company,
      email: supplierFormData.email,
      phone: supplierFormData.phone,
      address: supplierFormData.address,
      city: supplierFormData.city,
      country: supplierFormData.country,
      category: supplierFormData.category,
      status: supplierFormData.status,
      socialMedia: {
        whatsapp: supplierFormData.whatsapp,
        facebook: supplierFormData.facebook,
        instagram: supplierFormData.instagram,
        website: supplierFormData.website
      },
      paymentTerms: supplierFormData.paymentTerms,
      creditLimit: parseFloat(supplierFormData.creditLimit) || 0,
      notes: supplierFormData.notes
    };

    if (editingSupplier) {
      updateSupplier(editingSupplier.id, supplierData);
    } else {
      addSupplier(supplierData);
    }

    resetSupplierForm();
  };

  const handleCommunicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const supplier = suppliers.find(s => s.id === communicationFormData.supplierId);
    if (!supplier || !user) return;

    addCommunication({
      supplierId: communicationFormData.supplierId,
      supplierName: supplier.name,
      type: communicationFormData.type,
      subject: communicationFormData.subject,
      message: communicationFormData.message,
      direction: communicationFormData.direction,
      status: 'sent',
      userId: user.id,
      userName: user.name
    });

    resetCommunicationForm();
  };

  const resetSupplierForm = () => {
    setSupplierFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: 'Argentina',
      category: '',
      status: 'active',
      whatsapp: '',
      facebook: '',
      instagram: '',
      website: '',
      paymentTerms: '',
      creditLimit: '',
      notes: ''
    });
    setShowSupplierForm(false);
    setEditingSupplier(null);
  };

  const resetCommunicationForm = () => {
    setCommunicationFormData({
      supplierId: '',
      type: 'whatsapp',
      subject: '',
      message: '',
      direction: 'outgoing'
    });
    setShowCommunicationForm(false);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setSupplierFormData({
      name: supplier.name,
      company: supplier.company,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      city: supplier.city,
      country: supplier.country,
      category: supplier.category,
      status: supplier.status,
      whatsapp: supplier.socialMedia.whatsapp || '',
      facebook: supplier.socialMedia.facebook || '',
      instagram: supplier.socialMedia.instagram || '',
      website: supplier.socialMedia.website || '',
      paymentTerms: supplier.paymentTerms,
      creditLimit: supplier.creditLimit.toString(),
      notes: supplier.notes
    });
    setEditingSupplier(supplier);
    setShowSupplierForm(true);
  };

  const handleDeleteSupplier = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este proveedor?')) {
      deleteSupplier(id);
    }
  };

  const openSocialMedia = (type: string, handle: string) => {
    let url = '';
    switch (type) {
      case 'whatsapp':
        url = `https://wa.me/${handle.replace(/[^0-9]/g, '')}`;
        break;
      case 'facebook':
        url = `https://facebook.com/${handle}`;
        break;
      case 'instagram':
        url = `https://instagram.com/${handle}`;
        break;
      case 'website':
        url = handle.startsWith('http') ? handle : `https://${handle}`;
        break;
    }
    if (url) window.open(url, '_blank');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };

  const getCommunicationIcon = (type: string) => {
    switch (type) {
      case 'whatsapp':
        return <MessageCircle className="h-4 w-4 text-green-500" />;
      case 'facebook':
        return <Facebook className="h-4 w-4 text-blue-600" />;
      case 'instagram':
        return <Instagram className="h-4 w-4 text-pink-500" />;
      case 'email':
        return <Mail className="h-4 w-4 text-gray-600" />;
      case 'phone':
        return <Phone className="h-4 w-4 text-blue-500" />;
      case 'meeting':
        return <Calendar className="h-4 w-4 text-purple-500" />;
      default:
        return <MessageCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Users className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">CRM - Gestión de Proveedores</h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCommunicationForm(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Send className="h-5 w-5 mr-2" />
            Nueva Comunicación
          </button>
          <button
            onClick={() => setShowSupplierForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Proveedor
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('suppliers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'suppliers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="h-5 w-5 inline mr-2" />
              Proveedores ({suppliers.length})
            </button>
            <button
              onClick={() => setActiveTab('communications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'communications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageCircle className="h-5 w-5 inline mr-2" />
              Comunicaciones ({communications.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'orders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="h-5 w-5 inline mr-2" />
              Órdenes ({orders.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'suppliers' && (
            <div className="space-y-6">
              {/* Filtros */}
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Buscar proveedores..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos los estados</option>
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                  <option value="pending">Pendientes</option>
                </select>
              </div>

              {/* Lista de proveedores */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSuppliers.map((supplier) => (
                  <div key={supplier.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <Building className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                          <p className="text-sm text-gray-600">{supplier.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(supplier.status)}
                        <span className="text-xs text-gray-500">{getStatusLabel(supplier.status)}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {supplier.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {supplier.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {supplier.city}, {supplier.country}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Límite: ${supplier.creditLimit.toLocaleString()}
                      </div>
                    </div>

                    {/* Redes sociales */}
                    <div className="flex space-x-2 mb-4">
                      {supplier.socialMedia.whatsapp && (
                        <button
                          onClick={() => openSocialMedia('whatsapp', supplier.socialMedia.whatsapp!)}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                          title="WhatsApp"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </button>
                      )}
                      {supplier.socialMedia.facebook && (
                        <button
                          onClick={() => openSocialMedia('facebook', supplier.socialMedia.facebook!)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="Facebook"
                        >
                          <Facebook className="h-4 w-4" />
                        </button>
                      )}
                      {supplier.socialMedia.instagram && (
                        <button
                          onClick={() => openSocialMedia('instagram', supplier.socialMedia.instagram!)}
                          className="p-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors"
                          title="Instagram"
                        >
                          <Instagram className="h-4 w-4" />
                        </button>
                      )}
                      {supplier.socialMedia.website && (
                        <button
                          onClick={() => openSocialMedia('website', supplier.socialMedia.website!)}
                          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                          title="Sitio Web"
                        >
                          <Globe className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditSupplier(supplier)}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteSupplier(supplier.id)}
                        className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'communications' && (
            <div className="space-y-6">
              {/* Filtro por proveedor */}
              <div className="flex space-x-4">
                <select
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos los proveedores</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name} - {supplier.company}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lista de comunicaciones */}
              <div className="space-y-4">
                {communications
                  .filter(comm => !selectedSupplier || comm.supplierId === selectedSupplier)
                  .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                  .map((communication) => (
                    <div key={communication.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center">
                          {getCommunicationIcon(communication.type)}
                          <div className="ml-3">
                            <h4 className="font-medium text-gray-900">{communication.subject}</h4>
                            <p className="text-sm text-gray-600">
                              {communication.supplierName} • {communication.userName}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            communication.direction === 'outgoing' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {communication.direction === 'outgoing' ? 'Enviado' : 'Recibido'}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {communication.createdAt.toLocaleDateString()} {communication.createdAt.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700">{communication.message}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Módulo de Órdenes</h3>
              <p className="text-gray-600">Próximamente: Gestión completa de órdenes de compra</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de formulario de proveedor */}
      {showSupplierForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold mb-6">
              {editingSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}
            </h3>
            
            <form onSubmit={handleSupplierSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información básica */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2">Información Básica</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Contacto
                    </label>
                    <input
                      type="text"
                      value={supplierFormData.name}
                      onChange={(e) => setSupplierFormData({ ...supplierFormData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Empresa
                    </label>
                    <input
                      type="text"
                      value={supplierFormData.company}
                      onChange={(e) => setSupplierFormData({ ...supplierFormData, company: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={supplierFormData.email}
                      onChange={(e) => setSupplierFormData({ ...supplierFormData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={supplierFormData.phone}
                      onChange={(e) => setSupplierFormData({ ...supplierFormData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría
                    </label>
                    <input
                      type="text"
                      value={supplierFormData.category}
                      onChange={(e) => setSupplierFormData({ ...supplierFormData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: Bebidas, Panadería, Limpieza"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <select
                      value={supplierFormData.status}
                      onChange={(e) => setSupplierFormData({ ...supplierFormData, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                      <option value="pending">Pendiente</option>
                    </select>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2">Ubicación y Términos</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección
                    </label>
                    <input
                      type="text"
                      value={supplierFormData.address}
                      onChange={(e) => setSupplierFormData({ ...supplierFormData, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      value={supplierFormData.city}
                      onChange={(e) => setSupplierFormData({ ...supplierFormData, city: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      País
                    </label>
                    <input
                      type="text"
                      value={supplierFormData.country}
                      onChange={(e) => setSupplierFormData({ ...supplierFormData, country: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Términos de Pago
                    </label>
                    <input
                      type="text"
                      value={supplierFormData.paymentTerms}
                      onChange={(e) => setSupplierFormData({ ...supplierFormData, paymentTerms: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: 30 días, Contado, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Límite de Crédito
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={supplierFormData.creditLimit}
                      onChange={(e) => setSupplierFormData({ ...supplierFormData, creditLimit: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Redes sociales */}
              <div>
                <h4 className="font-medium text-gray-900 border-b pb-2 mb-4">Redes Sociales y Contacto</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      WhatsApp
                    </label>
                    <input
                      type="text"
                      value={supplierFormData.whatsapp}
                      onChange={(e) => setSupplierFormData({ ...supplierFormData, whatsapp: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+54 11 1234-5678"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Facebook
                    </label>
                    <input
                      type="text"
                      value={supplierFormData.facebook}
                      onChange={(e) => setSupplierFormData({ ...supplierFormData, facebook: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="usuario.facebook"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instagram
                    </label>
                    <input
                      type="text"
                      value={supplierFormData.instagram}
                      onChange={(e) => setSupplierFormData({ ...supplierFormData, instagram: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="@usuario_instagram"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sitio Web
                    </label>
                    <input
                      type="url"
                      value={supplierFormData.website}
                      onChange={(e) => setSupplierFormData({ ...supplierFormData, website: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://www.ejemplo.com"
                    />
                  </div>
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas
                </label>
                <textarea
                  value={supplierFormData.notes}
                  onChange={(e) => setSupplierFormData({ ...supplierFormData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Información adicional sobre el proveedor..."
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetSupplierForm}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingSupplier ? 'Actualizar' : 'Crear'} Proveedor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de formulario de comunicación */}
      {showCommunicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Nueva Comunicación</h3>
            
            <form onSubmit={handleCommunicationSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proveedor
                  </label>
                  <select
                    value={communicationFormData.supplierId}
                    onChange={(e) => setCommunicationFormData({ ...communicationFormData, supplierId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seleccionar proveedor</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name} - {supplier.company}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Comunicación
                  </label>
                  <select
                    value={communicationFormData.type}
                    onChange={(e) => setCommunicationFormData({ ...communicationFormData, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="whatsapp">WhatsApp</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="email">Email</option>
                    <option value="phone">Teléfono</option>
                    <option value="meeting">Reunión</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asunto
                </label>
                <input
                  type="text"
                  value={communicationFormData.subject}
                  onChange={(e) => setCommunicationFormData({ ...communicationFormData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensaje
                </label>
                <textarea
                  value={communicationFormData.message}
                  onChange={(e) => setCommunicationFormData({ ...communicationFormData, message: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <select
                  value={communicationFormData.direction}
                  onChange={(e) => setCommunicationFormData({ ...communicationFormData, direction: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="outgoing">Enviado</option>
                  <option value="incoming">Recibido</option>
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetCommunicationForm}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Registrar Comunicación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRM;