import {
  FormGroup,
  FormControlLabel,
  FormControl,
  InputLabel,
  FormHelperText,
  Box,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { number, string, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangeEvent, useState } from 'react';
import CryptoJS from "crypto-js";
import { Button, TextInput, Checkbox, Select as VenusSelect } from "@contentstack/venus-components";

// Define the form schema with Zod
const formSchema = z.object({
  environments: z.object({
    production: z.boolean(),
    staging: z.boolean(),
    development: z.boolean(),
  }).refine((data) => Object.values(data).some(Boolean), {
    message: "Please select at least one environment",
  }),
  locales: z.object({
    'en-us': z.boolean(),
    'fr-fr': z.boolean(),
    'es': z.boolean(),
  }).refine((data) => Object.values(data).some(Boolean), {
    message: "Please select at least one locale",
  }),
  variant: z.object({
    id: z.number(),
    label: z.string().min(1, "Variant is required"),
    value: z.string().min(1, "Variant is required")
  }),
  entryUid: z.string().min(1, "Entry UID is required"),
  contentType: z.string().min(1, "Content Type is required"),
});

type FormValues = z.infer<typeof formSchema>;

const App = () => {
  const {
    control,
    getValues
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      environments: {
        production: false,
        staging: false,
        development: false,
      },
      locales: {
        'en-us': false,
        'fr-fr': false,
        'es': false,
      },
      variant: {
        id: 0,
        label: "Select Variant",
        value: ""
      },
      entryUid: '',
      contentType: '',
    },
  });

  const [formErrors, setFormErrors] = useState<{ path: string, message: string }[]>([]);

  const handleButtonClick = () => {
    const data = getValues();
    console.log(data);
    const validationResult = formSchema.safeParse(data);

    if (!validationResult.success) {
      console.log(validationResult.error.errors);
      const errorMessages = validationResult.error.errors.map(error => ({ path: error.path[0] as string, message: error.message }));
      setFormErrors(errorMessages);
      return;
    }

    setFormErrors([]);

    const result = {
      environments: Object.entries(data.environments)
        .filter(([_, selected]) => selected)
        .map(([env]) => env),
      locales: Object.entries(data.locales)
        .filter(([_, selected]) => selected)
        .map(([locale]) => locale),
      variant: data.variant,
      entryUid: data.entryUid,
      contentType: data.contentType,
    };

    const encryptedResult = CryptoJS.AES.encrypt(
      JSON.stringify(result),
      import.meta.env.VITE_APP_ENCRYPT_SECRET
    ).toString();

    window.open(`https://demo-graph.contentstackapps.com?data=${btoa(encryptedResult)}`, "_blank");
    // window.open(`http://localhost:3002?data=${btoa(encryptedResult)}`, "_blank");
  };

  const handleFieldChange = (fieldName: string) => {
    setFormErrors((prevErrors) => prevErrors.filter(error => error.path !== fieldName));
  };

  return (
    <Box sx={{ margin: "0 20px 0 5px"}}>
      <FormGroup className="flex flex-col gap-8 p-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg mb-1" style={{
            color: "var(--color-brand-black-base)"
          }}>Select Environments</h2>
          <Controller
            name="environments.production"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                style={{
                  margin: "0px 0px 0px 6px"
                }}
                control={
                  <Checkbox
                    size="small"
                    checked={field.value}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      field.onChange(e);
                      handleFieldChange("environments");
                    }}
                  />
                }
                label={<span className="text-sm">Production</span>}
              />
            )}
          />
          <Controller
            name="environments.staging"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                style={{
                  margin: "0px 0px 0px 6px"
                }}
                control={
                  <Checkbox
                    size="small"
                    checked={field.value}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      field.onChange(e);
                      handleFieldChange("environments");
                    }}
                  />
                }
                label={<span className="text-sm">Staging</span>}
              />
            )}
          />
          <Controller
            name="environments.development"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                style={{
                  margin: "0px 0px 0px 6px"
                }}
                control={
                  <Checkbox
                    size="small"
                    checked={field.value}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      field.onChange(e);
                      handleFieldChange("environments");
                    }}
                  />
                }
                label={<span className="text-sm">Development</span>}
              />
            )}
          />
          {formErrors.length > 0 && (
            <FormHelperText error style={{
              margin: "0px 0px 0px 6px",
            }}>{formErrors.find((error) => (error.path === "environments"))?.message}</FormHelperText>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-lg mb-1">Select Locales</h2>
          <Controller
            name="locales.en-us"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                style={{
                  margin: "0px 0px 0px 6px"
                }}
                control={
                  <Checkbox
                    size="small"
                    checked={field.value}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      field.onChange(e);
                      handleFieldChange("locales");
                    }}
                  />
                }
                label={<span className="text-sm">en-us</span>}
              />
            )}
          />
          <Controller
            name="locales.fr-fr"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                style={{
                  margin: "0px 0px 0px 6px"
                }}
                control={
                  <Checkbox
                    size="small"
                    checked={field.value}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      field.onChange(e);
                      handleFieldChange("locales");
                    }}
                  />
                }
                label={<span className="text-sm">fr-fr</span>}
              />
            )}
          />
          <Controller
            name="locales.es"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                style={{
                  margin: "0px 0px 0px 6px"
                }}
                control={
                  <Checkbox
                    size="small"
                    checked={field.value}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      field.onChange(e);
                      handleFieldChange("locales");
                    }}
                  />
                }
                label={<span className="text-sm">es</span>}
              />
            )}
          />
          {formErrors.length > 0 && (
            <FormHelperText error style={{
              margin: "0px 0px 0px 6px",
            }}>{formErrors.find((error) => (error.path === "locales"))?.message}</FormHelperText>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-lg mb-1">Select Variant</h2>
          <FormControl size="small">
            <Controller
              name="variant"
              control={control}
              render={({ field }) => (
                //@ts-ignore
                <VenusSelect
                  {...field}
                  placeholder='Select Variant'
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    field.onChange(e);
                    handleFieldChange("variant");
                  }}
                  options={[
                    {
                      id: 0,
                      label: "Select Variant",
                      value: ""
                    },
                    {
                      id: 1,
                      label: "Business Audience",
                      value: "business"
                    },
                    {
                      id: 2,
                      label: "Tech Enthusiasts",
                      value: "tech"
                    }
                  ]}
                  value={field.value}
                />
              )}
            />
          </FormControl>
          {formErrors.length > 0 && (
            <FormHelperText error style={{
              margin: "0px 0px 0px 6px",
            }}>{formErrors.find((error) => (error.path === "variant"))?.message}</FormHelperText>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-lg mb-1">Entry uid</h2>
            <Controller
              name="entryUid"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label="Entry uid"
                  version="v2"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    field.onChange(e);
                    handleFieldChange("entryUid");
                  }}
                />
              )}
            />
          {formErrors.length > 0 && (
            <FormHelperText error style={{
              margin: "0px 0px 0px 6px",
            }}>{formErrors.find((error) => (error.path === "entryUid"))?.message}</FormHelperText>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-lg mb-1">Content Type</h2>
            <Controller
              name="contentType"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label="Content Type"
                  version="v2"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    field.onChange(e);
                    handleFieldChange("contentType");
                  }}
                />
              )}
            />
          {formErrors.length > 0 && (
            <FormHelperText error style={{
              margin: "0px 0px 0px 6px",
            }}>{formErrors.find((error) => (error.path === "contentType"))?.message}</FormHelperText>
          )}
        </div>
      </FormGroup>

      <Button version="v2" icon="v2-FormSubmit" style={{ margin: "24px 0" }} onClick={handleButtonClick}>Submit</Button>
    </Box>
  );
}

export default App;