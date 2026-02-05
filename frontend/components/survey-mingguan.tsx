"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import LikertQuestion from "./ui/likert-scale"
import { Button } from "./ui/button"
import { dataAPI } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SurveyProps {
    bahagia : number | undefined,
    semangat : number | undefined,
    beban : number | undefined,
    cemas : number | undefined,
    bantuan_guru : number | undefined,
    menghargai : number | undefined,
    aman : number | undefined,
    bullying : number | undefined,
    desc_bullying : string | undefined,
    tidur : number | undefined,
    kehadiran : number | undefined,
    open_question : string | undefined    
}

export default function SurveyMingguan(){

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [setuju, setSetuju] = useState<boolean | undefined>(undefined);

    const [form, setForm] = useState<SurveyProps>({
        bahagia : undefined,
        semangat : undefined,
        beban : undefined,
        cemas : undefined,
        bantuan_guru : undefined,
        menghargai : undefined,
        aman : undefined,
        bullying : undefined,
        desc_bullying : "",
        tidur : undefined,
        kehadiran : undefined,
        open_question : "",
    });

    const handleChangeMingguan = (field: keyof SurveyProps, value: number) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setMessage("");

        if (setuju !== true){
            window.scrollTo({ top: 0, behavior: "smooth" });
            setError("Anda harus menyetujui pernyataan kesediaan sebelum mengisi survei.");
            return;
        }

        try {
            const response = await dataAPI.submitSurveyMingguan(form);
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

        {/* 🔵 Bagian Kesediaan */}
        <div className="p-4 border rounded-xl bg-blue-50">
            <p className="font-medium mb-3 text-blue-900">
                Saya bersedia mengisi dengan jujur. <span className="text-red-500">*</span>
            </p>

            <button
                type="button"
                onClick={() => setSetuju(true)}
                className={`
                    w-full py-3 rounded-xl font-semibold transition-all
                    flex items-center justify-center space-x-2
                    ${setuju
                        ? "bg-green-600 hover:bg-green-700 text-white shadow-md scale-[1.01]"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                    }
                `}
            >
                {setuju && (
                    <span className="text-xl">✔</span>
                )}
                <span>
                    {setuju ? "Sudah Menyetujui" : "Ya, Saya Setuju"}
                </span>
            </button>
        </div>

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
                question="Secara umum minggu ini saya merasa bahagia"
                value={form.bahagia}
                onChange={(value) => handleChangeMingguan("bahagia", value)}
                required
            />
        </div>
        {/* Semangat */}
        <div>
            <LikertQuestion
                number={2}
                question="Saya bersemangat mengikuti pelajaran minggu ini"
                value={form.semangat}
                onChange={(value) => handleChangeMingguan("semangat", value)}
                required
            />
        </div>
        {/* Fokus */}
        <div>
            <LikertQuestion
                number={3}
                question="Beban tugas/PR minggu ini terasa berlebihan bagi saya"
                value={form.beban}
                onChange={(value) => handleChangeMingguan("beban", value)}
                required
            />
        </div>
        {/* Bertenaga */}
        <div>
            <LikertQuestion
                number={4}
                question="Saya sering cemas tentang pelajaran minggu in"
                value={form.cemas}
                onChange={(value) => handleChangeMingguan("cemas", value)}
                required
            />
        </div>
        {/* Stress */}
        <div>
            <LikertQuestion
                number={5}
                question="Saya mudah meminta bantuan pada guru jika kesulitan"
                value={form.bantuan_guru}
                onChange={(value) => handleChangeMingguan("bantuan_guru", value)}
                required
            />
        </div>
        {/* Dukungan Teman dan Guru */}
        <div>
            <LikertQuestion
                number={6}
                question="Kelas saya memiliki suasana yang saling menghargai"
                value={form.menghargai}
                onChange={(value) => handleChangeMingguan("menghargai", value)}
                required
            />
        </div>
        {/* Dukungan Guru */}
        <div>
            <LikertQuestion
                number={7}
                question="Saya merasa aman di sekolah sepanjang minggu ini"
                value={form.aman}
                onChange={(value) => handleChangeMingguan("aman", value)}
                required
            />
        </div>
        <div>
            <LikertQuestion
                number={8}
                question="Dalam 7 hari terakhir, apakah kamu mengalami perundungan (bullying)?"
                value={form.bullying}
                option={["ya", "Tidak"]}
                onChange={(value) => handleChangeMingguan("bullying", value)}
                required
            />
        </div>

        {form.bullying === 1 && (
            <div className="w-full max-w-3xl mt-6">
                <label className="block text-blue-800 font-medium mb-2">
                Jelaskan secara singkat pengalaman perundungan (bullying) yang kamu alami:
                </label>
                <textarea
                value={form.desc_bullying}
                onChange={(e) =>
                    setForm((prev) => ({ ...prev, desc_bullying: e.target.value }))
                }
                className="w-full p-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Tuliskan jawaban Anda..."
                rows={3}
                required
                />
            </div>
        )}

        <div>
            <LikertQuestion
                number={9}
                question="Rata-rata durasi tidur malam saya"
                value={form.tidur}
                option={["< 6 jam", "6-7 jam", "7-8 jam", "> 8 jam"]}
                onChange={(value) => handleChangeMingguan("tidur", value)}
                required
            />
        </div>

        <div>
            <LikertQuestion
                number={10}
                question="Kehadiran & ketepatan waktu saya minggu ini"
                value={form.kehadiran}
                option={["Baik", "Sedang", "Perlu Perbaikan"]}
                onChange={(value) => handleChangeMingguan("kehadiran", value)}
                required
            />
        </div>

        <div className="w-full max-w-3xl mt-6">
                <label className="block text-blue-800 font-medium mb-2">
                Apa yang paling mengganggu kebahagiaan Anda minggu ini:
                </label>
                <textarea
                value={form.open_question}
                onChange={(e) =>
                    setForm((prev) => ({ ...prev, open_question: e.target.value }))
                }
                className="w-full p-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Tuliskan jawaban Anda..."
                rows={3}
                required
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