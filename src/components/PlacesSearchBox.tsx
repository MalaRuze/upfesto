"use client";

import { Libraries, useGoogleMapsScript } from "use-google-maps-script";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { useRef, useState } from "react";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { MapPin } from "lucide-react";

type PlacesSearchBoxProps = {
  onSelectAddress: (
    locationAddress: string | null,
    locationLat: number | null,
    locationLon: number | null,
  ) => void;
  defaultValue?: string;
};

const libraries: Libraries = ["places"];

const PlacesSearchBox = ({
  defaultValue,
  onSelectAddress,
}: PlacesSearchBoxProps) => {
  // load the Google Maps API script
  const { isLoaded, loadError } = useGoogleMapsScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries,
  });

  // check if the Google Maps API script has loaded
  if (!isLoaded) return null;
  if (loadError) return <div>Error loading location input</div>;

  // if the script has loaded, render the search box
  return (
    <ReadySearchBox
      defaultValue={defaultValue}
      onSelectAddress={onSelectAddress}
    />
  );
};

const ReadySearchBox = ({
  defaultValue,
  onSelectAddress,
}: PlacesSearchBoxProps) => {
  const { toast } = useToast();
  // places autocomplete hook
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({ debounce: 300, defaultValue });

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (e.target.value === "") {
      onSelectAddress(null, null, null);
    }
    onSelectAddress(e.target.value, null, null);
  };

  // handle suggestion select
  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = getLatLng(results[0]);
      onSelectAddress(address, lat, lng);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error with location selection",
        variant: "destructive",
      });
    }
  };

  // logic to handle dropdown visibility
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.relatedTarget)
    ) {
      setShowSuggestions(false);
    }
  };

  return (
    <FormItem
      className="relative h-content"
      onFocus={() => setShowSuggestions(true)}
      onBlur={handleBlur}
    >
      <FormLabel>Location</FormLabel>
      {/* Input */}
      <Input
        placeholder="Add location"
        icon={<MapPin />}
        value={value}
        disabled={!ready}
        onChange={handleChange}
        role="combobox"
      />
      {/* Suggestions Dropdown */}
      {showSuggestions && status === "OK" && (
        <div
          className="bg-white w-full border rounded-lg absolute drop-shadow p-1"
          ref={dropdownRef}
        >
          {data.map(({ place_id, description }) => (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              key={place_id}
              onClick={() => {
                handleSelect(description);
              }}
            >
              <span className="truncate">{description}</span>
            </Button>
          ))}
        </div>
      )}
    </FormItem>
  );
};

export default PlacesSearchBox;
