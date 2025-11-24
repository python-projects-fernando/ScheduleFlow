import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
import { get } from '../services/api';
import type { ServiceTypesResponse } from '../types/dtos/service';
import type { GetAvailabilityResponse } from '../types/dtos/booking';
import type { ServiceType } from '../types/enums';
import { format, parse } from 'date-fns'; // Importar funções para formatação/parsing de data
import { enUS, ptBR } from 'date-fns/locale'; // Importar locales para formatação

function dateToISOStringWithLocalTimezone(date: Date): string {
  const offsetMinutes = date.getTimezoneOffset();
  const offsetMs = offsetMinutes * 60 * 1000;
  const timestamp = date.getTime();
  const localTimestamp = timestamp - offsetMs;
  const localDate = new Date(localTimestamp);

  const isoString = localDate.toISOString();

  const absOffsetHours = Math.abs(offsetMinutes / 60);
  const offsetHours = Math.floor(absOffsetHours);
  const offsetMinutesRemainder = Math.abs(offsetMinutes) % 60;

  const sign = offsetMinutes > 0 ? '-' : '+';
  const formattedOffset = `${sign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutesRemainder.toString().padStart(2, '0')}`;

  return isoString.replace('Z', formattedOffset);
}

// --- Dados Mockados (Hardcoded) ---
// Simula a resposta do endpoint GET /api/booking/availability
const mockAvailabilityData: GetAvailabilityResponse = {
  service_type: "consultation",
  time_slots: [
    // --- 30/11/2025 ---
    { start: "2025-11-30T09:00:00.000Z", end: "2025-11-30T09:30:00.000Z", is_available: true },
    { start: "2025-11-30T09:30:00.000Z", end: "2025-11-30T10:00:00.000Z", is_available: true },
    { start: "2025-11-30T10:00:00.000Z", end: "2025-11-30T10:30:00.000Z", is_available: false }, // Ocupado
    { start: "2025-11-30T10:30:00.000Z", end: "2025-11-30T11:00:00.000Z", is_available: true },
    { start: "2025-11-30T14:00:00.000Z", end: "2025-11-30T14:30:00.000Z", is_available: true },
    { start: "2025-11-30T14:30:00.000Z", end: "2025-11-30T15:00:00.000Z", is_available: false }, // Ocupado

    // --- 01/12/2025 ---
    { start: "2025-12-01T10:00:00.000Z", end: "2025-12-01T10:30:00.000Z", is_available: true },
    { start: "2025-12-01T10:30:00.000Z", end: "2025-12-01T11:00:00.000Z", is_available: true },
    { start: "2025-12-01T11:00:00.000Z", end: "2025-12-01T11:30:00.000Z", is_available: true },
    { start: "2025-12-01T15:00:00.000Z", end: "2025-12-01T15:30:00.000Z", is_available: false }, // Ocupado

    // --- 02/12/2025 ---
    { start: "2025-12-02T09:00:00.000Z", end: "2025-12-02T09:30:00.000Z", is_available: false }, // Ocupado
    { start: "2025-12-02T09:30:00.000Z", end: "2025-12-02T10:00:00.000Z", is_available: false }, // Ocupado
    { start: "2025-12-02T16:00:00.000Z", end: "2025-12-02T16:30:00.000Z", is_available: false }, // Ocupado

    // --- 03/12/2025 ---
    { start: "2025-12-03T11:00:00.000Z", end: "2025-12-03T11:30:00.000Z", is_available: true },
    { start: "2025-12-03T11:30:00.000Z", end: "2025-12-03T12:00:00.000Z", is_available: true },
    { start: "2025-12-03T12:00:00.000Z", end: "2025-12-03T12:30:00.000Z", is_available: false }, // Ocupado

    // --- 04/12/2025 ---
    { start: "2025-12-04T13:00:00.000Z", end: "2025-12-04T13:30:00.000Z", is_available: true },
    { start: "2025-12-04T13:30:00.000Z", end: "2025-12-04T14:00:00.000Z", is_available: true },
    { start: "2025-12-04T14:00:00.000Z", end: "2025-12-04T14:30:00.000Z", is_available: true },

    // --- 05/12/2025 ---
    { start: "2025-12-05T10:00:00.000Z", end: "2025-12-05T10:30:00.000Z", is_available: false }, // Ocupado
    { start: "2025-12-05T10:30:00.000Z", end: "2025-12-05T11:00:00.000Z", is_available: true },

  ],
  available_services: [
    {
      id: "service-1",
      name: "Cardiology Consultation",
      description: "Initial consultation focusing on cardiovascular diagnosis.",
      duration_minutes: 60,
      price: 200.0,
      service_type: "consultation",
      created_at: "2024-01-01T00:00:00.000Z",
      updated_at: "2024-01-01T00:00:00.000Z"
    },
    {
      id: "service-2",
      name: "Dermatology Consultation",
      description: "Consultation for skin condition diagnosis and treatment.",
      duration_minutes: 45,
      price: 180.0,
      service_type: "consultation",
      created_at: "2024-01-01T00:00:00.000Z",
      updated_at: "2024-01-01T00:00:00.000Z"
    }
  ]
};
// --- Fim dos Dados Mockados ---

const CalendarAvailability: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false); // Estado opcional para indicar loading
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | "">("");

  // Estados para datas ISO (armazenam os objetos Date)
  const [searchStartDateISO, setSearchStartDateISO] = useState<Date>(new Date()); // Inicializa com a data de hoje
  const [searchEndDateISO, setSearchEndDateISO] = useState<Date | null>(null); // Inicializa com null

  // Estados para dados de disponibilidade e seleção
  const [availabilityData, setAvailabilityData] = useState<GetAvailabilityResponse | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDayAvailable, setIsDayAvailable] = useState<boolean>(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState<boolean>(false);

  // Estados para o locale detectado
  const [calendarLocale, setCalendarLocale] = useState<string>('en-US');
  const [dateFnsLocale, setDateFnsLocale] = useState(enUS); // Locale para date-fns

  // Estados para datas formatadas (exibição no input)
  const [searchStartDateFormatted, setSearchStartDateFormatted] = useState<string>('');
  const [searchEndDateFormatted, setSearchEndDateFormatted] = useState<string>('');

  // Efeito para detectar locale do navegador
  useEffect(() => {
    const browserLocale = navigator.language;
    const localeMap: Record<string, { dateFns: any; calendar: string }> = {
      'en-US': { dateFns: enUS, calendar: 'en-US' },
      'en-GB': { dateFns: enUS, calendar: 'en-GB' }, // date-fns enUS é geralmente suficiente para en-GB
      'pt-BR': { dateFns: ptBR, calendar: 'pt-BR' },
      'pt-PT': { dateFns: ptBR, calendar: 'pt-PT' }, // Usando ptBR para pt-PT também, ou ajuste se necessário
      'es-ES': { dateFns: enUS, calendar: 'es-ES' }, // date-fns não tem ES, usar enUS ou uma biblioteca específica
      'fr-FR': { dateFns: enUS, calendar: 'fr-FR' }, // date-fns não tem FR, usar enUS ou uma biblioteca específica
      'de-DE': { dateFns: enUS, calendar: 'de-DE' }, // date-fns não tem DE, usar enUS ou uma biblioteca específica
    };

    const mappedLocale = localeMap[browserLocale] || { dateFns: enUS, calendar: 'en-US' };
    setCalendarLocale(mappedLocale.calendar);
    setDateFnsLocale(mappedLocale.dateFns); // Define o locale para date-fns
  }, []);

  // Efeito para atualizar as datas formatadas quando as datas ISO mudam ou o locale muda
  useEffect(() => {
    setSearchStartDateFormatted(format(searchStartDateISO, 'dd/MM/yyyy', { locale: dateFnsLocale }));
  }, [searchStartDateISO, dateFnsLocale]);

  useEffect(() => {
    if (searchEndDateISO === null) {
      setSearchEndDateFormatted('');
    } else {
      setSearchEndDateFormatted(format(searchEndDateISO, 'dd/MM/yyyy', { locale: dateFnsLocale }));
    }
  }, [searchEndDateISO, dateFnsLocale]); // Este useEffect agora depende de searchEndDateISO

  // --- Função para Buscar Tipos de Serviço ---
  const fetchServiceTypes = async () => {
    try {
      const response = await get('/services/types') as ServiceTypesResponse;
      console.log("API response for service types:", response);

      if (response && Array.isArray(response.types)) {
        const sortedTypes = [...response.types].sort();
        setServiceTypes(sortedTypes as ServiceType[]);
      } else {
        console.error("Invalid response format from /api/services/types:", response);
        throw new Error("API returned an invalid response format for service types.");
      }
    } catch (error) {
      console.error("Error fetching service types:", error);
    }
  };

  // --- Efeito para Carregar Tipos de Serviço ---
  useEffect(() => {
    fetchServiceTypes();
  }, []);

  // Função para aplicar máscara de data (DD/MM/YYYY) a uma string
  const applyDateMask = (value: string): string => {
    const digitsOnly = value.replace(/\D/g, '');
    const truncated = digitsOnly.substring(0, 8);

    let masked = '';
    if (truncated.length > 0) {
      masked += truncated.substring(0, 2); // Dia
    }
    if (truncated.length > 2) {
      masked += '/' + truncated.substring(2, 4); // Barra + Mês
    }
    if (truncated.length > 4) {
      masked += '/' + truncated.substring(4, 8); // Barra + Ano
    }

    return masked;
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const maskedValue = applyDateMask(rawValue);
    setSearchStartDateFormatted(maskedValue);

    if (maskedValue.length === 10) {
      const parsedDate = parse(maskedValue, 'dd/MM/yyyy', new Date(), { locale: dateFnsLocale });
      if (!isNaN(parsedDate.getTime())) {
        setSearchStartDateISO(parsedDate);
      } else {
        console.error("Invalid date format for start date:", maskedValue);
      }
    } else if (maskedValue.length === 0) {
      setSearchStartDateISO(new Date()); // Volta para a data de hoje se o campo for limpo
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const maskedValue = applyDateMask(rawValue);
    setSearchEndDateFormatted(maskedValue);

    if (maskedValue.length === 10) {
      const parsedDate = parse(maskedValue, 'dd/MM/yyyy', new Date(), { locale: dateFnsLocale });
      if (!isNaN(parsedDate.getTime())) {
        setSearchEndDateISO(parsedDate);
      } else {
        console.error("Invalid date format for end date:", maskedValue);
      }
    } else if (maskedValue.length === 0) {
      setSearchEndDateISO(null); // Define como null se o campo for limpo
    }
  };

  const handleSearchAvailability = async () => {
    if (!selectedServiceType || !searchStartDateISO || !searchEndDateISO) {
      console.warn("Service type, start date, or end date not provided.");
      return;
    }

    setLoading(true);
    setAvailabilityData(null);

    const startOfDay = new Date(searchStartDateISO);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(searchEndDateISO);
    endOfDay.setHours(23, 59, 59, 999);

    const startDateWithTimezone = dateToISOStringWithLocalTimezone(startOfDay);
    const endDateWithTimezone = dateToISOStringWithLocalTimezone(endOfDay);

    console.log("Searching availability for:");
    console.log("- Service Type:", selectedServiceType);
    console.log("- Start Date (with local timezone, start of day):", startDateWithTimezone);
    console.log("- End Date (with local timezone, end of day):", endDateWithTimezone);

    try {
      const serviceTypeParam = selectedServiceType;
      const queryString = `?service_type=${encodeURIComponent(serviceTypeParam)}&start_date=${encodeURIComponent(startDateWithTimezone)}&end_date=${encodeURIComponent(endDateWithTimezone)}`;
      const endpoint = `/booking/availability${queryString}`;

      console.log("Fetching from endpoint:", endpoint);

      const response = await get(endpoint) as GetAvailabilityResponse;

      console.log("Raw API response:", response);

      if (response && typeof response === 'object') {
        setAvailabilityData(response);
        console.log("Fetched availability data set in state:", response);
      } else {
        console.error("Invalid response format from API:", response);
      }
    } catch (error) {
      console.error("Error fetching availability from API:", error);
      alert(`Failed to fetch availability: ${(error as Error).message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  // --- Função de Dia (modificada para usar availabilityData e lidar com searchEndDateISO sendo null) ---
const isDayWithAvailableSlots = (date: Date): boolean => {
  // Se não temos dados de disponibilidade ainda, nenhum dia tem slots
  if (!availabilityData) {
    return false;
  }

  // Converter a data do calendário para o início e fim do dia em ISO String (UTC)
  const dayStart = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0));
  const dayEnd = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999));

  // Verificar se *algum* slot *disponível* nos dados filtrados se sobrepõe ao dia
  return availabilityData.time_slots.some(slot => {
    const slotStart = new Date(slot.start);
    const slotEnd = new Date(slot.end);
    const slotIsAvailable = slot.is_available;

    // Verifica sobreposição com o DIA específico
    const overlapsWithDay = slotStart < dayEnd && slotEnd > dayStart;

    // Verifica se o slot está dentro do INTERVALO DE BUSCA
    // Agora, verifica se searchEndDateISO NÃO é null ANTES de fazer a comparação
    const isWithinSearchRange = searchEndDateISO !== null && slotStart < searchEndDateISO && slotEnd > searchStartDateISO;

    return slotIsAvailable && overlapsWithDay && isWithinSearchRange;
  });
};

  const isDayInRange = (date: Date): boolean => {
  // Verifica se searchEndDateISO NÃO é null antes de usar
  if (searchEndDateISO === null) return false; // Se não há data final, o intervalo é inválido

  const dayStart = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0));
  const dayEnd = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999));

  // Agora é seguro usar searchEndDateISO, pois já foi verificado
  return dayStart < searchEndDateISO && dayEnd >= searchStartDateISO;
};

  const handleDayClick = (value: Date) => {
    if (isDayInRange(value)) {
        if (isDayWithAvailableSlots(value)) {
            console.log(`Selected day: ${value.toISOString().split('T')[0]}`);
            setSelectedDate(value);
            setIsDayAvailable(true);
            alert(`You selected the day ${value.toLocaleDateString()}. This day has available times.`);
        } else {
            console.log(`Day ${value.toISOString().split('T')[0]} is within the range, but not available.`);
            setSelectedDate(null);
            setIsDayAvailable(false);
            alert(`The day ${value.toLocaleDateString()} is within the search range, but has no available times.`);
        }
    } else {
        console.log(`Click on day ${value.toISOString().split('T')[0]} was ignored (out of range).`);
        alert(`This day (${value.toLocaleDateString()}) is not part of the current search range.`);
    }
  };

  const tileClassName = ({ date, view }: { date: Date; view: 'month' | 'year' | 'decade' | 'century' }) => {
    if (view === 'month') {
      if (!isDayInRange(date)) {
        return 'react-calendar__tile--out-of-range';
      } else if (isDayWithAvailableSlots(date)) {
        return 'react-calendar__tile--available';
      } else {
        return 'react-calendar__tile--unavailable';
      }
    }
    return '';
  };

  const tileDisabled = ({ date, view }: { date: Date; view: 'month' | 'year' | 'decade' | 'century' }) => {
    if (view === 'month') {
      return !isDayInRange(date);
    }
    return false;
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedServiceId(serviceId);
  };

  const handleTimeSlotSelect = (timeSlotStart: string) => {
    setSelectedDateTime(timeSlotStart);
  };

  const handleConfirmAppointment = async () => {
    if (!selectedServiceId || !selectedDateTime) {
      console.warn("Service ID or DateTime not selected yet.");
      return;
    }

    setIsBooking(true);

    try {
      console.log("Attempting to book appointment...");
      console.log("- Selected Service ID:", selectedServiceId);
      console.log("- Selected Date Time:", selectedDateTime);

      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log("Appointment booked successfully!");
      alert(`Appointment confirmed for ${new Date(selectedDateTime).toLocaleString()} with service ID ${selectedServiceId}.`);

      setSelectedServiceId(null);
      setSelectedDateTime(null);
      setSelectedDate(null);
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("An error occurred while confirming the appointment.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Calendar - Availability</h2>

          {/* --- Formulário de Seleção (Sempre Visível) --- */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="serviceTypeSelect" className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type:
                </label>
                <select
                  id="serviceTypeSelect"
                  value={selectedServiceType || ''}
                  onChange={(e) => setSelectedServiceType(e.target.value as ServiceType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a type...</option>
                  {serviceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="startDateInput" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date (DD/MM/YYYY):
                </label>
                <input
                  type="text"
                  id="startDateInput"
                  value={searchStartDateFormatted}
                  onChange={handleStartDateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="DD/MM/YYYY"
                />
              </div>
              <div>
                <label htmlFor="endDateInput" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date (DD/MM/YYYY):
                </label>
                <input
                  type="text"
                  id="endDateInput"
                  value={searchEndDateFormatted}
                  onChange={handleEndDateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="DD/MM/YYYY"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={handleSearchAvailability}
                disabled={!selectedServiceType || !searchStartDateISO || !searchEndDateISO || loading}
                className={`w-full px-4 py-2 rounded-md shadow-sm text-white font-medium ${
                  selectedServiceType && searchStartDateISO && searchEndDateISO && !loading
                    ? "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {loading ? "Searching..." : "Search Availability"}
              </button>
            </div>
          </div>
          {/* --- Fim do Formulário de Seleção --- */}

          {/* --- Calendário e Detalhes (Exibidos após busca) --- */}
          {availabilityData && (
            <div>
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                <Calendar
                  onChange={() => {}}
                  value={null}
                  tileClassName={tileClassName}
                  tileDisabled={tileDisabled}
                  onClickDay={handleDayClick}
                  locale={calendarLocale}
                  minDate={searchStartDateISO}
                  maxDate={searchEndDateISO || undefined}
                  className="w-full"
                />
              </div>

              {selectedDate && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Details for {selectedDate.toLocaleDateString()}:
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Status: <span className={isDayAvailable ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                      {isDayAvailable ? 'Available' : 'Unavailable (in range)'}
                    </span>
                  </p>
                  {isDayAvailable && (
                    <div>
                      <h4 className="text-md font-medium text-gray-800 mb-2">Available Services: (Select one)</h4>
                      <ul className="space-y-2">
                        {availabilityData.available_services.map((service, index) => (
                          <li
                            key={`service-${index}`}
                            onClick={() => handleServiceSelect(service.id)}
                            className={`cursor-pointer bg-white p-3 rounded border ${
                              selectedServiceId === service.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:bg-gray-50"
                            } shadow-sm`}
                          >
                            <div className="font-medium text-gray-900">{service.name}</div>
                            <div className="text-sm text-gray-600 italic mt-1">{service.description}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              ({service.duration_minutes} min) - R$ {service.price?.toFixed(2)}
                            </div>
                          </li>
                        ))}
                      </ul>

                      <h4 className="text-md font-medium text-gray-800 mb-1 mt-4">Available Times: (Select one)</h4>
                      <ul className="mb-4 space-y-2">
                        {availabilityData.time_slots
                          .filter(slot => {
                            const slotStart = new Date(slot.start);
                            const slotDate = new Date(slotStart.getFullYear(), slotStart.getMonth(), slotStart.getDate());
                            const selectedDateWithoutTime = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
                            return slotDate.getTime() === selectedDateWithoutTime.getTime() && slot.is_available;
                          })
                          .map((slot, index) => (
                            <li
                              key={index}
                              onClick={() => handleTimeSlotSelect(slot.start)}
                              className={`cursor-pointer bg-white p-2 rounded border ${
                                selectedDateTime === slot.start
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:bg-gray-50"
                              }`}
                            >
                              {new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </li>
                          ))}
                      </ul>

                      <div className="mt-6">
                        <button
                          onClick={handleConfirmAppointment}
                          disabled={!selectedServiceId || !selectedDateTime || isBooking}
                          className={`w-full px-4 py-2 rounded-md shadow-sm text-white font-medium ${
                            selectedServiceId && selectedDateTime && !isBooking
                              ? "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              : "bg-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {isBooking ? "Confirming..." : "Confirm Appointment"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {/* --- Fim do Calendário e Detalhes --- */}
        </div>
      </div>
    </div>
  );
};

export default CalendarAvailability;