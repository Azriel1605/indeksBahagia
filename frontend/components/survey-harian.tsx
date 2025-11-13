"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import LikertQuestion from "./ui/likert-scale"
import { Button } from "./ui/button"
import { dataAPI } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SurveyProps {
    bahagia: number | undefined;
    semangat: number | undefined;
    fokus: number | undefined;
    bertenaga: number | undefined;
    stress: number | undefined;
    dukungan_teman: number | undefined;
    dukungan_guru: number | undefined;
    aman: number | undefined;
    rasakan: string | undefined;
}

export default function SurveyHarian(){

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [form, setForm] = useState<SurveyProps>({
        bahagia: undefined,
        semangat: undefined,
        fokus: undefined,
        bertenaga: undefined,
        stress: undefined,
        dukungan_teman: undefined,
        dukungan_guru: undefined,
        aman: undefined,
        rasakan: "",
    });

    const handleChangeHarian = (field: keyof SurveyProps, value: number) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setMessage("");
        try {
            const response = await dataAPI.submitSurveyHarian(form);
            const resData = await response.json();

            if (response.ok) {
                setMessage(resData.message || "Data berhasil disimpan.");
                window.location.reload();
            } else {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });

                setError(resData.message || "Terjadi kesalahan saat menyimpan data.");
            }

        } catch (error) {
            console.error("Error submitting survey:", error);
            setError("Terjadi kesalahan saat menyimpan data.");
        } finally {
            setIsLoading(false);
        }
    };

    const labels = [
        "Sangat Tidak Setuju",
        "Tidak Setuju",
        "Netral",
        "Setuju",
        "Sangat Setuju",
    ];
    
    return (
    <form onSubmit={handleSubmit}>
        {message && (
                <Alert>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
        {error && (
        <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
        </Alert>
        )}
        <Card>

        <CardHeader>
        <CardTitle>Data Pribadi</CardTitle>
        <CardDescription>Informasi dasar identitas lansia</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
        {/* Pertanyaan Skala Likert */}
        {/* Bahagia */}
        <div>
            <LikertQuestion
                number={1}
                question="Saya merasa cukup bahagia hari ini"
                value={form.bahagia}
                onChange={(value) => handleChangeHarian("bahagia", value)}
                required
            />
        </div>
        {/* Semangat */}
        <div>
            <LikertQuestion
                number={2}
                question="Semangat saya untuk belajar hari ini tinggi"
                value={form.semangat}
                onChange={(value) => handleChangeHarian("semangat", value)}
                required
            />
        </div>
        {/* Fokus */}
        <div>
            <LikertQuestion
                number={3}
                question="Saya bisa fokus saat pelajaran hari ini"
                value={form.fokus}
                onChange={(value) => handleChangeHarian("fokus", value)}
                required
            />
        </div>
        {/* Bertenaga */}
        <div>
            <LikertQuestion
                number={4}
                question="Saya merasa bertenaga/berenergi hari ini"
                value={form.bertenaga}
                onChange={(value) => handleChangeHarian("bertenaga", value)}
                required
            />
        </div>
        {/* Stress */}
        <div>
            <LikertQuestion
                number={5}
                question="Saya merasa stres/tertekan hari ini"
                value={form.stress}
                onChange={(value) => handleChangeHarian("stress", value)}
                required
            />
        </div>
        {/* Dukungan Teman dan Guru */}
        <div>
            <LikertQuestion
                number={6}
                question="Saya merasa didukung oleh teman hari ini"
                value={form.dukungan_teman}
                onChange={(value) => handleChangeHarian("dukungan_teman", value)}
                required
            />
        </div>
        {/* Dukungan Guru */}
        <div>
            <LikertQuestion
                number={7}
                question="Saya merasa didukung oleh guru hari ini"
                value={form.dukungan_guru}
                onChange={(value) => handleChangeHarian("dukungan_guru", value)}
                required
            />
        </div>
        {/* Rasa Aman */}
        <div>
            <LikertQuestion
                number={8}
                question="Saya merasa aman di lingkungan sekolah hari ini"
                value={form.aman}
                onChange={(value) => handleChangeHarian("aman", value)}
                required
            />
        </div>

        {/* Pertanyaan terbuka */}
        <div className="w-full max-w-3xl mt-6">
            <label className="block text-blue-800 font-medium mb-2">
            Ceritakan perasaan Anda hari ini:
            </label>
            <textarea
            value={form.rasakan}
            onChange={(e) =>
                setForm((prev) => ({ ...prev, rasakan: e.target.value }))
            }
            className="w-full p-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Tuliskan jawaban Anda..."
            rows={3}
            />
        </div>
        
        <div className="flex justify-end space-x-4">
            <Button type="submit" disabled={isLoading}>
                {isLoading ? "Menyimpan..." : "Simpan Data"}
            </Button>
        </div>
        </CardContent>
    </Card>
    </form>
)}